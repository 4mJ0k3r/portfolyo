const fetch = require('node-fetch');
const cheerio = require('cheerio');
const { OpenAI } = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Extract GitHub data from profile and repositories
 * @param {string} githubUrl - GitHub profile URL
 * @param {Array} topRepoUrls - Array of top repository URLs (optional)
 * @returns {Object} GitHub data including repos, stars, languages, and repo details
 */
async function fetchGitHubData(githubUrl, topRepoUrls = []) {
  try {
    // Extract username from GitHub URL
    const githubUsername = githubUrl.split('/').pop();
    
    // Prepare headers with optional GitHub token for higher rate limits
    const headers = {
      'User-Agent': 'PortFolyo-App'
    };
    
    // Add GitHub token if available (increases rate limit from 60 to 5000 requests/hour)
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
      console.log('🔑 Using GitHub token for authenticated requests');
    } else {
      console.log('⚠️ No GitHub token found - using unauthenticated requests (60/hour limit)');
    }
    
    // Fetch all repositories
    const reposResponse = await fetch(`https://api.github.com/users/${githubUsername}/repos?per_page=100&sort=updated`, {
      headers
    });
    
    if (!reposResponse.ok) {
      throw new Error(`GitHub API error: ${reposResponse.status}`);
    }
    
    const repos = await reposResponse.json();
    
    // Calculate total stats
    const totalRepos = repos.length;
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    
    // Aggregate languages across all repos
    const languages = {};
    for (const repo of repos.slice(0, 20)) { // Limit to top 20 repos to avoid rate limits
      try {
        const langResponse = await fetch(repo.languages_url);
        if (langResponse.ok) {
          const repoLanguages = await langResponse.json();
          Object.entries(repoLanguages).forEach(([lang, bytes]) => {
            languages[lang] = (languages[lang] || 0) + bytes;
          });
        }
      } catch (error) {
        console.warn(`Failed to fetch languages for ${repo.name}:`, error.message);
      }
    }
    
    // Process top repositories (either provided URLs or auto-select top starred)
    let topRepos = [];
    if (topRepoUrls.length > 0) {
      // Use provided repository URLs
      for (const repoUrl of topRepoUrls.slice(0, 5)) {
        try {
          // Extract owner and repo name from GitHub URL
          // Expected format: https://github.com/owner/repo
          const urlParts = repoUrl.split('/');
          if (urlParts.length >= 5 && urlParts[2] === 'github.com') {
            const repoOwner = urlParts[3];
            const repoName = urlParts[4];
            console.log(`🔍 Fetching repository details for: ${repoOwner}/${repoName}`);
            const repoDetails = await fetchRepositoryDetails(repoOwner, repoName);
            topRepos.push(repoDetails);
          } else {
            console.warn(`Invalid GitHub URL format: ${repoUrl}`);
          }
        } catch (error) {
          console.warn(`Failed to fetch details for ${repoUrl}:`, error.message);
        }
      }
    } else {
      // Auto-select top 3 starred repositories
      const topStarredRepos = repos
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 3);
      
      for (const repo of topStarredRepos) {
        try {
          const repoDetails = await fetchRepositoryDetails(githubUsername, repo.name);
          topRepos.push(repoDetails);
        } catch (error) {
          console.warn(`Failed to fetch details for ${repo.name}:`, error.message);
        }
      }
    }
    
    return {
      totalRepos,
      totalStars,
      languages,
      topRepos
    };
    
  } catch (error) {
    console.error('Error fetching GitHub data:', error);
    return {
      totalRepos: 0,
      totalStars: 0,
      languages: {},
      topRepos: []
    };
  }
}

/**
 * Fetch detailed information for a specific repository
 * @param {string} username - GitHub username
 * @param {string} repoName - Repository name
 * @returns {Object} Repository details
 */
async function fetchRepositoryDetails(username, repoName) {
  try {
    // Prepare headers with optional GitHub token
    const headers = {
      'User-Agent': 'PortFolyo-App'
    };
    
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }
    
    // Fetch repository details
    const repoResponse = await fetch(`https://api.github.com/repos/${username}/${repoName}`, { headers });
    const repoData = await repoResponse.json();
    
    // Fetch languages
    const langResponse = await fetch(`https://api.github.com/repos/${username}/${repoName}/languages`, { headers });
    const languages = await langResponse.json();
    
    // Fetch recent commits
    const commitsResponse = await fetch(`https://api.github.com/repos/${username}/${repoName}/commits?per_page=10`, { headers });
    const commits = await commitsResponse.json();
    const recentCommitDates = commits.map(commit => commit.commit.author.date.split('T')[0]);
    
    // Fetch README
    let readmeExcerpt = "";
    try {
      const readmeResponse = await fetch(`https://api.github.com/repos/${username}/${repoName}/readme`, { headers });
      if (readmeResponse.ok) {
        const readmeData = await readmeResponse.json();
        const readmeContent = Buffer.from(readmeData.content, 'base64').toString('utf-8');
        readmeExcerpt = readmeContent.substring(0, 1000).replace(/[#*`]/g, '').trim();
      }
    } catch (error) {
      console.warn(`No README found for ${repoName}`);
    }
    
    return {
      name: repoData.name,
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      languages,
      recentCommitDates,
      readmeExcerpt,
      description: repoData.description || "",
      topics: repoData.topics || []
    };
    
  } catch (error) {
    console.error(`Error fetching repository details for ${repoName}:`, error);
    return {
      name: repoName,
      stars: 0,
      forks: 0,
      languages: {},
      recentCommitDates: [],
      readmeExcerpt: "",
      description: "",
      topics: []
    };
  }
}

/**
 * Fetch Codeforces data
 * @param {string} cfUrl - Codeforces profile URL
 * @returns {Object} Codeforces rating data
 */
async function fetchCodeforcesData(cfUrl) {
  try {
    // Extract handle from Codeforces URL
    const handle = cfUrl.split('/').pop();
    
    const response = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`);
    if (!response.ok) {
      throw new Error(`Codeforces API error: ${response.status}`);
    }
    
    const data = await response.json();
    if (data.status === 'OK' && data.result.length > 0) {
      const user = data.result[0];
      return {
        rating: user.rating || 0,
        maxRating: user.maxRating || 0,
        handle: user.handle
      };
    }
    
    return { rating: 0, maxRating: 0, handle };
    
  } catch (error) {
    console.error('Error fetching Codeforces data:', error);
    return { rating: 0, maxRating: 0, handle: '' };
  }
}

/**
 * Fetch LeetCode data
 * @param {string} lcUrl - LeetCode profile URL
 * @returns {Object} LeetCode solved problems data
 */
async function fetchLeetCodeData(lcUrl) {
  try {
    // Extract username from LeetCode URL
    const username = lcUrl.split('/').pop().replace('/', '');
    
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          submitStats: submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
            }
          }
        }
      }
    `;
    
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: JSON.stringify({
        query,
        variables: { username }
      })
    });
    
    if (!response.ok) {
      throw new Error(`LeetCode API error: ${response.status}`);
    }
    
    const data = await response.json();
    const submissions = data.data?.matchedUser?.submitStats?.acSubmissionNum || [];
    
    let easySolved = 0, mediumSolved = 0, hardSolved = 0;
    
    submissions.forEach(sub => {
      switch (sub.difficulty) {
        case 'Easy':
          easySolved = sub.count;
          break;
        case 'Medium':
          mediumSolved = sub.count;
          break;
        case 'Hard':
          hardSolved = sub.count;
          break;
      }
    });
    
    return {
      easySolved,
      mediumSolved,
      hardSolved,
      totalSolved: easySolved + mediumSolved + hardSolved
    };
    
  } catch (error) {
    console.error('Error fetching LeetCode data:', error);
    return {
      easySolved: 0,
      mediumSolved: 0,
      hardSolved: 0,
      totalSolved: 0
    };
  }
}

/**
 * Fetch article data from URL
 * @param {string} articleUrl - Article URL
 * @returns {Object} Article analysis data
 */
async function fetchArticleData(articleUrl) {
  try {
    const response = await fetch(articleUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Article fetch error: ${response.status}`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Extract main content (try multiple selectors)
    let content = '';
    const contentSelectors = [
      'article',
      '.post-content',
      '.entry-content',
      '.content',
      'main',
      '.article-body',
      '[role="main"]'
    ];
    
    for (const selector of contentSelectors) {
      const element = $(selector);
      if (element.length > 0) {
        content = element.text();
        break;
      }
    }
    
    // Fallback to body if no specific content found
    if (!content) {
      content = $('body').text();
    }
    
    // Clean and analyze content
    const cleanContent = content
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s.,!?;:]/g, '')
      .trim();
    
    const words = cleanContent.split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    
    // Simple readability score (Flesch Reading Ease approximation)
    const sentences = cleanContent.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgWordsPerSentence = wordCount / Math.max(sentences.length, 1);
    const avgSyllablesPerWord = 1.5; // Rough approximation
    const readabilityScore = Math.max(0, Math.min(100, 
      206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord)
    ));
    
    const excerpt = cleanContent.substring(0, 300) + (cleanContent.length > 300 ? '...' : '');
    
    return {
      url: articleUrl,
      wordCount,
      readabilityScore: Math.round(readabilityScore),
      excerpt
    };
    
  } catch (error) {
    console.error(`Error fetching article data for ${articleUrl}:`, error);
    return {
      url: articleUrl,
      wordCount: 0,
      readabilityScore: 0,
      excerpt: ""
    };
  }
}

/**
 * Fetch LinkedIn data (basic scraping approach)
 * @param {string} linkedInUrl - LinkedIn profile URL
 * @returns {Object} LinkedIn profile data
 */
async function fetchLinkedInData(linkedInUrl) {
  try {
    // Note: LinkedIn heavily restricts scraping, so this is a basic implementation
    // In production, you'd want to use LinkedIn's official API with OAuth
    
    const response = await fetch(linkedInUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`LinkedIn fetch error: ${response.status}`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Extract basic information (this is limited due to LinkedIn's restrictions)
    const headline = $('meta[property="og:title"]').attr('content') || '';
    const about = $('meta[property="og:description"]').attr('content') || '';
    
    // Try to extract connections count (very limited)
    const connectionsText = $('.pv-top-card--list-bullet li').text();
    const connectionsMatch = connectionsText.match(/(\d+)\+?\s*connections?/i);
    const connections = connectionsMatch ? parseInt(connectionsMatch[1]) : 0;
    
    return {
      headline: headline.replace(' | LinkedIn', ''),
      about,
      connections,
      experience: [] // Would need API access for detailed experience
    };
    
  } catch (error) {
    console.error('Error fetching LinkedIn data:', error);
    return {
      headline: "",
      about: "",
      connections: 0,
      experience: []
    };
  }
}

/**
 * Fetch Twitter data (basic approach)
 * @param {string} twitterUrl - Twitter profile URL
 * @returns {Object} Twitter profile data
 */
async function fetchTwitterData(twitterUrl) {
  try {
    // Extract handle from Twitter URL
    const handle = twitterUrl.split('/').pop();
    
    // Note: Twitter API requires authentication, so this is a basic scraping approach
    // In production, you'd want to use Twitter API v2 with Bearer token
    
    const response = await fetch(twitterUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Twitter fetch error: ${response.status}`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Extract basic information from meta tags
    const bio = $('meta[property="og:description"]').attr('content') || '';
    
    // Try to extract follower count (very limited without API)
    const followersText = $('[data-testid="UserFollowersContainer"]').text();
    const followersMatch = followersText.match(/(\d+(?:,\d+)*)\s*Followers/i);
    const followers = followersMatch ? parseInt(followersMatch[1].replace(/,/g, '')) : 0;
    
    return {
      bio,
      followers,
      recentTweets: [] // Would need API access for recent tweets
    };
    
  } catch (error) {
    console.error('Error fetching Twitter data:', error);
    return {
      bio: "",
      followers: 0,
      recentTweets: []
    };
  }
}

/**
 * Call LLM with aggregated data for analysis
 * @param {Object} aggregatedData - All collected data from various sources
 * @returns {Object} AI analysis results
 */
async function callLLMWithPrompt(aggregatedData) {
  try {
    const prompt = `You are an expert technical recruiter and developer assessment specialist. Analyze the following developer profile data and provide a comprehensive assessment. DEVELOPER DATA: ${JSON.stringify(aggregatedData)} Please analyze this data and return a JSON response with the following structure: {"primaryExpertise": "Main technical expertise area (e.g., 'Full-Stack JavaScript Developer', 'Python Data Scientist', 'DevOps Engineer')", "hireableScore": 85, "subScores": {"codeActivityScore": 4, "writingScore": 3, "socialFitScore": 4}, "scoreJustifications": {"codeActivity": ["Strong GitHub activity with X repositories and Y stars", "Consistent commit history showing regular development", "Diverse technology stack demonstrating adaptability"], "writing": ["Well-documented repositories with clear README files", "Technical articles show good communication skills"], "socialFit": ["Active professional presence on LinkedIn", "Engaged in developer community through social media"]}, "narrativeSummary": "A 2-3 paragraph professional summary highlighting the developer's strengths, experience, and potential value to employers.", "radarAxes": {"codeActivity": 75, "problemSolving": 80, "projectImpact": 65, "writingDocumentation": 70, "socialCommunity": 60, "verificationTrust": 85}, "radarMeta": {"version": "1.0", "lastComputed": "2024-01-15T10:30:00.000Z", "inputsUsed": ["github.totalRepos", "codeforces.rating", "articles.length"], "normalizationNotes": "Values clamped to 0-100 scale using weighted combinations of platform stats, verification status, and profile completeness.", "inferenceNotes": ["Used subScores.codeActivityScore as fallback for commit activity"]}} SCORING CRITERIA: - hireableScore (0-100): Overall hirability based on: * GitHub activity (25%): Repository quality, commit frequency, star count * Competitive Programming (20%): Codeforces/LeetCode ratings and solved problems * Writing Quality (20%): Article quality, documentation, communication * Social Presence (10%): Professional networking, community engagement * Experience & Projects (25%): Work experience, project complexity, impact - subScores (1-5 each): * codeActivityScore: GitHub contributions, code quality, project diversity * writingScore: Documentation quality, article writing, communication clarity * socialFitScore: Professional presence, networking, community involvement - radarAxes (0-100 each): * codeActivity: GitHub repos, commits, stars, verification (prefer platform stats over subScores) * problemSolving: Codeforces rating, LeetCode solved, skills proficiency, projects count * projectImpact: GitHub stars, featured projects, project complexity, repository quality * writingDocumentation: README quality, articles, documentation, bio presence * socialCommunity: GitHub followers, LinkedIn presence, Twitter followers, portfolio website * verificationTrust: Email/GitHub/phone/documents verified, verified skills count RADAR CALCULATION RULES: Use explicit platform statistics when available (GitHub repos/stars, Codeforces rating, LeetCode solved). Scale subScores (1-5) to 0-100 by multiplying by 20. Use conservative proxies (list lengths, boolean flags) only when primary data is missing. Document all fallbacks in inferenceNotes. Clamp all values to 0-100 range. Provide 2-3 specific justifications for each sub-score. Be honest but constructive in your assessment. Return ONLY the JSON response, no additional text.`;

    // Prepare the request payload
    const requestPayload = {
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert technical recruiter. Analyze developer profiles and provide structured assessments in JSON format. Be Very Strict."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    };

    // 🚀 LOG: JSON data being sent to LLM
    console.log('='.repeat(80));
    console.log('📤 JSON DATA SENT TO LLM:');
    console.log('='.repeat(80));
    console.log(JSON.stringify(requestPayload, null, 2));
    console.log('='.repeat(80));

    const response = await openai.chat.completions.create(requestPayload);

    // 🚀 LOG: JSON data received from LLM
    console.log('='.repeat(80));
    console.log('📥 JSON DATA RECEIVED FROM LLM:');
    console.log('='.repeat(80));
    console.log(JSON.stringify(response, null, 2));
    console.log('='.repeat(80));

    const content = response.choices[0].message.content.trim();
    
    // Clean the response - remove markdown code blocks if present
    let cleanedContent = content;
    if (content.startsWith('```json')) {
      cleanedContent = content.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (content.startsWith('```')) {
      cleanedContent = content.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    // Parse JSON response
    let analysisResult;
    try {
      analysisResult = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('Failed to parse LLM response as JSON:', parseError);
      console.error('Raw response:', content);
      // Fallback response
      analysisResult = {
        primaryExpertise: "Software Developer",
        hireableScore: 50,
        subScores: {
          codeActivityScore: 3,
          writingScore: 3,
          socialFitScore: 3
        },
        scoreJustifications: {
          codeActivity: ["Profile analysis completed with limited data"],
          writing: ["Assessment based on available information"],
          socialFit: ["Basic professional presence detected"]
        },
        narrativeSummary: "Developer profile analyzed. Additional data sources recommended for more comprehensive assessment.",
        radarAxes: {
          codeActivity: 50,
          problemSolving: 50,
          projectImpact: 50,
          writingDocumentation: 50,
          socialCommunity: 50,
          verificationTrust: 50
        },
        radarMeta: {
          version: "1.0",
          lastComputed: new Date().toISOString(),
          inputsUsed: ["fallback"],
          normalizationNotes: "Fallback values assigned due to LLM parsing failure.",
          inferenceNotes: ["LLM response could not be parsed, using default radar values"]
        }
      };
    }
    
    return analysisResult;
    
  } catch (error) {
    console.error('Error calling LLM:', error);
    // Return fallback response
    return {
      primaryExpertise: "Software Developer",
      hireableScore: 0,
      subScores: {
        codeActivityScore: 0,
        writingScore: 0,
        socialFitScore: 0
      },
      scoreJustifications: {
        codeActivity: ["Analysis failed - please try again"],
        writing: ["Analysis failed - please try again"],
        socialFit: ["Analysis failed - please try again"]
      },
      narrativeSummary: "Unable to complete analysis at this time. Please ensure all data sources are accessible and try again.",
      radarAxes: {
        codeActivity: 0,
        problemSolving: 0,
        projectImpact: 0,
        writingDocumentation: 0,
        socialCommunity: 0,
        verificationTrust: 0
      },
      radarMeta: {
        version: "1.0",
        lastComputed: new Date().toISOString(),
        inputsUsed: ["error"],
        normalizationNotes: "Error fallback values assigned due to analysis failure.",
        inferenceNotes: ["Analysis failed completely, all radar values set to 0"]
      }
    };
  }
}

/**
 * Main function to run skill extraction and analysis
 * @param {Object} profile - User profile with social links and data
 * @returns {Object} Complete AI analysis results
 */
async function runSkillExtractor(profile) {
  try {
    console.log(`🤖 Starting AI skill extraction for profile: ${profile.user}`);
    
    // Debug: Log the actual values for Twitter and LinkedIn
    console.log(`🔍 Debug - twitterHandle: "${profile.twitterHandle}" (type: ${typeof profile.twitterHandle})`);
    console.log(`🔍 Debug - linkedinUrl: "${profile.linkedinUrl}" (type: ${typeof profile.linkedinUrl})`);
    
    // Collect all data sources in parallel
    const dataPromises = [];
    const dataSourcesUsed = [];
    
    // GitHub data (only if username is provided and not empty)
    if (profile.githubUsername && profile.githubUsername.trim() !== '') {
      const githubUrl = `https://github.com/${profile.githubUsername}`;
      // Pass topRepoUrls from profile if available
      const topRepoUrls = profile.topRepoUrls && Array.isArray(profile.topRepoUrls) 
        ? profile.topRepoUrls.filter(url => url && url.trim() !== '') 
        : [];
      dataPromises.push(
        fetchGitHubData(githubUrl, topRepoUrls).then(data => ({ github: data }))
      );
      dataSourcesUsed.push('github');
    }
    
    // Codeforces data (only if username is provided and not empty)
    if (profile.codeforcesUsername && profile.codeforcesUsername.trim() !== '') {
      const cfUrl = `https://codeforces.com/profile/${profile.codeforcesUsername}`;
      dataPromises.push(
        fetchCodeforcesData(cfUrl).then(data => ({ codeforces: data }))
      );
      dataSourcesUsed.push('codeforces');
    }
    
    // LeetCode data (only if username is provided and not empty)
    if (profile.leetcodeUsername && profile.leetcodeUsername.trim() !== '') {
      const lcUrl = `https://leetcode.com/${profile.leetcodeUsername}`;
      dataPromises.push(
        fetchLeetCodeData(lcUrl).then(data => ({ leetcode: data }))
      );
      dataSourcesUsed.push('leetcode');
    }
    
    // LinkedIn data (only if URL is provided, not empty, and not a placeholder)
    if (profile.linkedinUrl && 
        profile.linkedinUrl.trim() !== '' && 
        profile.linkedinUrl !== 'https://linkedin.com/in/username' &&
        profile.linkedinUrl !== 'https://www.linkedin.com/in/username' &&
        !profile.linkedinUrl.includes('placeholder')) {
      dataPromises.push(
        fetchLinkedInData(profile.linkedinUrl).then(data => ({ linkedin: data }))
      );
      dataSourcesUsed.push('linkedin');
    } else {
      console.log(`⏭️ Skipping LinkedIn - URL: "${profile.linkedinUrl}"`);
    }
    
    // Twitter data (only if handle is provided, not empty, and not a placeholder)
    if (profile.twitterHandle && 
        profile.twitterHandle.trim() !== '' && 
        profile.twitterHandle !== '@username' &&
        profile.twitterHandle !== 'username' &&
        !profile.twitterHandle.includes('placeholder')) {
      const twitterUrl = `https://twitter.com/${profile.twitterHandle.replace('@', '')}`;
      dataPromises.push(
        fetchTwitterData(twitterUrl).then(data => ({ twitter: data }))
      );
      dataSourcesUsed.push('twitter');
    } else {
      console.log(`⏭️ Skipping Twitter - Handle: "${profile.twitterHandle}"`);
    }
    
    // Article data (only if article URLs are provided and not empty)
    if (profile.articleUrls && Array.isArray(profile.articleUrls) && profile.articleUrls.length > 0) {
      const validArticleUrls = profile.articleUrls.filter(url => url && url.trim() !== '');
      if (validArticleUrls.length > 0) {
        const articlePromises = validArticleUrls.slice(0, 3).map(url => 
          fetchArticleData(url)
        );
        dataPromises.push(
          Promise.all(articlePromises).then(articles => ({ articles }))
        );
        dataSourcesUsed.push('articles');
      }
    }
    
    // Wait for all data collection to complete
    const dataResults = await Promise.allSettled(dataPromises);
    
    // Aggregate all successful results
    const aggregatedData = {};
    dataResults.forEach(result => {
      if (result.status === 'fulfilled') {
        Object.assign(aggregatedData, result.value);
      }
    });
    
    // Note: Removed existingStats to avoid duplicate data in LLM payload
    // The fresh data from APIs above already contains the latest platform stats
    
    // Add profile context
    aggregatedData.profileContext = {
      bio: profile.bio,
      headline: profile.headline,
      skills: profile.skills,
      experience: profile.experience,
      projects: profile.projects,
      yearsOfExperience: profile.yearsOfExperience
    };
    
    console.log(`📊 Data collected from ${dataSourcesUsed.length} sources: ${dataSourcesUsed.join(', ')}`);
    
    // Call LLM for analysis
    const aiAnalysis = await callLLMWithPrompt(aggregatedData);
    
    // Add metadata
    aiAnalysis.aiAnalysis = {
      lastAnalyzed: new Date(),
      dataSourcesUsed,
      analysisVersion: "1.0"
    };
    
    console.log(`✅ AI analysis completed. Hireable score: ${aiAnalysis.hireableScore}/100`);
    
    return aiAnalysis;
    
  } catch (error) {
    console.error('Error in runSkillExtractor:', error);
    throw new Error(`Skill extraction failed: ${error.message}`);
  }
}

module.exports = {
  runSkillExtractor
};