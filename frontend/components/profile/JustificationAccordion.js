import { useState } from 'react';

export default function JustificationAccordion({ profile }) {
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const justifications = profile?.scoreJustifications;
  
  if (!justifications) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Score Breakdown Available</h3>
        <p className="text-gray-500">Detailed score justifications will appear here once analysis is complete.</p>
      </div>
    );
  }

  const sections = [
    {
      key: 'codeActivity',
      title: 'Code Activity',
      score: profile?.subScores?.codeActivityScore,
      maxScore: 5,
      color: 'blue',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      justifications: justifications.codeActivity
    },
    {
      key: 'writing',
      title: 'Writing Quality',
      score: profile?.subScores?.writingScore,
      maxScore: 5,
      color: 'green',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      ),
      justifications: justifications.writing
    },
    {
      key: 'socialFit',
      title: 'Social Fit',
      score: profile?.subScores?.socialFitScore,
      maxScore: 5,
      color: 'purple',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      justifications: justifications.socialFit
    }
  ];

  const getColorClasses = (color, variant = 'default') => {
    const colorMap = {
      blue: {
        default: 'bg-blue-50 border-blue-200 text-blue-900',
        header: 'bg-blue-100 text-blue-800',
        content: 'bg-blue-50 text-blue-800',
        score: 'text-blue-600'
      },
      green: {
        default: 'bg-green-50 border-green-200 text-green-900',
        header: 'bg-green-100 text-green-800',
        content: 'bg-green-50 text-green-800',
        score: 'text-green-600'
      },
      purple: {
        default: 'bg-purple-50 border-purple-200 text-purple-900',
        header: 'bg-purple-100 text-purple-800',
        content: 'bg-purple-50 text-purple-800',
        score: 'text-purple-600'
      }
    };
    return colorMap[color]?.[variant] || colorMap.blue[variant];
  };

  return (
    <div className="space-y-4">
      {sections.map((section) => {
        if (!section.justifications || section.justifications.length === 0) return null;
        
        const isOpen = openSections[section.key];
        
        return (
          <div key={section.key} className={`rounded-lg border-2 ${getColorClasses(section.color)}`}>
            <button
              onClick={() => toggleSection(section.key)}
              className={`w-full px-6 py-4 text-left flex items-center justify-between hover:${getColorClasses(section.color, 'header')} transition-colors duration-200 rounded-t-lg ${isOpen ? getColorClasses(section.color, 'header') : ''}`}
            >
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${getColorClasses(section.color, 'header')}`}>
                  {section.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{section.title}</h3>
                  {section.score !== undefined && (
                    <p className="text-sm opacity-75">
                      Score: <span className={`font-bold ${getColorClasses(section.color, 'score')}`}>
                        {section.score}/{section.maxScore}
                      </span>
                    </p>
                  )}
                </div>
              </div>
              <svg 
                className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isOpen && (
              <div className={`px-6 py-4 border-t ${getColorClasses(section.color, 'content')}`}>
                <ul className="space-y-3">
                  {section.justifications.map((reason, index) => (
                    <li key={index} className="flex items-start">
                      <div className={`w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 ${getColorClasses(section.color, 'score').replace('text-', 'bg-')}`}></div>
                      <span className="text-sm leading-relaxed">{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}
      
      {sections.every(section => !section.justifications || section.justifications.length === 0) && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Detailed Justifications</h3>
          <p className="text-gray-500">Score breakdowns will be available once AI analysis is complete.</p>
        </div>
      )}
    </div>
  );
}