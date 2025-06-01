import React, { useState } from 'react';

const PricingPage = () => {
  const [activeTab, setActiveTab] = useState('developers');
  const [selectedPlan, setSelectedPlan] = useState(null);

  const developerPlans = [
    {
      id: 'dev-free',
      name: 'Free',
      price: '$0',
      period: '/month',
      features: [
        'Unlimited projects',
        'Basic profile customization',
        'Community support'
      ],
      popular: false
    },
    {
      id: 'dev-premium',
      name: 'Premium',
      price: '$15',
      period: '/month',
      features: [
        'All Free features',
        'Advanced profile customization',
        'Priority support',
        'Featured profile'
      ],
      popular: true
    },
    {
      id: 'dev-enterprise',
      name: 'Enterprise',
      price: 'Contact Us',
      period: '',
      features: [
        'All Premium features',
        'Custom solutions',
        'Dedicated account manager',
        'Advanced analytics',
        'Team collaboration'
      ],
      popular: false
    }
  ];

  const recruiterPlans = [
    {
      id: 'rec-starter',
      name: 'Starter',
      price: '$49',
      period: '/month',
      features: [
        'Basic search filters',
        'Limited candidate profiles (50)',
        'Community support',
        'Standard messaging'
      ],
      popular: false
    },
    {
      id: 'rec-professional',
      name: 'Professional',
      price: '$199',
      period: '/month',
      features: [
        'All Starter features',
        'Advanced search filters',
        'Unlimited candidate profiles',
        'Priority support',
        'Advanced messaging',
        'Analytics dashboard'
      ],
      popular: true
    },
    {
      id: 'rec-enterprise',
      name: 'Enterprise',
      price: 'Contact Us',
      period: '',
      features: [
        'All Professional features',
        'Custom solutions',
        'Dedicated account manager',
        'Advanced analytics',
        'Team collaboration',
        'API access'
      ],
      popular: false
    }
  ];

  const comparisonData = [
    { feature: 'Unlimited Projects', free: 'Yes', premium: 'Yes', devEnterprise: 'Yes', starter: 'No', professional: 'No', recEnterprise: 'No' },
    { feature: 'Advanced Profile Customization', free: 'No', premium: 'Yes', devEnterprise: 'Yes', starter: 'No', professional: 'No', recEnterprise: 'No' },
    { feature: 'Priority Support', free: 'No', premium: 'Yes', devEnterprise: 'Yes', starter: 'No', professional: 'Yes', recEnterprise: 'Yes' },
    { feature: 'Featured Profile', free: 'No', premium: 'Yes', devEnterprise: 'Yes', starter: 'No', professional: 'No', recEnterprise: 'No' },
    { feature: 'Custom Solutions', free: 'No', premium: 'No', devEnterprise: 'Yes', starter: 'No', professional: 'No', recEnterprise: 'Yes' },
    { feature: 'Dedicated Account Manager', free: 'No', premium: 'No', devEnterprise: 'Yes', starter: 'No', professional: 'No', recEnterprise: 'Yes' },
    { feature: 'Advanced Analytics', free: 'No', premium: 'No', devEnterprise: 'Yes', starter: 'No', professional: 'Yes', recEnterprise: 'Yes' },
    { feature: 'Team Collaboration', free: 'No', premium: 'No', devEnterprise: 'Yes', starter: 'No', professional: 'Yes', recEnterprise: 'Yes' },
    { feature: 'Basic Search Filters', free: 'No', premium: 'No', devEnterprise: 'No', starter: 'Yes', professional: 'Yes', recEnterprise: 'Yes' },
    { feature: 'Unlimited Candidate Profiles', free: 'No', premium: 'No', devEnterprise: 'No', starter: 'No', professional: 'Yes', recEnterprise: 'Yes' },
    { feature: 'API Access', free: 'No', premium: 'No', devEnterprise: 'No', starter: 'No', professional: 'No', recEnterprise: 'Yes' }
  ];

  const handlePlanClick = (planId) => {
    setSelectedPlan(planId);
  };

  const isPlanSelected = (planId) => {
    return selectedPlan === planId;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <div className="relative max-w-7xl rounded-2xl mx-auto py-54 overflow-hidden">
          <div className="absolute inset-0">
            <img src="/images/p1.png" alt="Pricing Background" className="absolute inset-0 w-full h-full object-cover  rounded-2xl" />
            <div className="absolute inset-0 bg-black/10 rounded-2xl"></div>
          </div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Find the perfect plan for your needs</h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Whether you're a developer looking to showcase your work or a recruiter seeking top talent, we have a plan that fits.
            </p>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 text-lg font-semibold transition duration-300">
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 rounded-lg p-1 flex">
            <button
              onClick={() => setActiveTab('developers')}
              className={`px-8 py-3 rounded-md transition-all ${
                activeTab === 'developers'
                  ? 'bg-white text-blue-600 shadow-sm font-semibold'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              For Developers
            </button>
            <button
              onClick={() => setActiveTab('recruiters')}
              className={`px-8 py-3 rounded-md transition-all ${
                activeTab === 'recruiters'
                  ? 'bg-white text-blue-600 shadow-sm font-semibold'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              For Recruiters
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {(activeTab === 'developers' ? developerPlans : recruiterPlans).map((plan, index) => (
            <div 
              key={plan.id} 
              onClick={() => handlePlanClick(plan.id)}
              className={`bg-white rounded-lg shadow-lg p-8 relative cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${
                plan.popular 
                  ? 'border-2 border-blue-500' 
                  : isPlanSelected(plan.id)
                    ? 'border-2 border-blue-400 bg-blue-50'
                    : 'border border-gray-200 hover:border-blue-300'
              }`}
            >
              {plan.popular && (
                <span className="absolute top-4 right-4 bg-blue-500 text-white text-sm px-3 py-1 rounded-full font-semibold">
                  Most Popular
                </span>
              )}
              {isPlanSelected(plan.id) && !plan.popular && (
                <span className="absolute top-4 right-4 bg-blue-400 text-white text-sm px-3 py-1 rounded-full font-semibold">
                  Selected
                </span>
              )}
              <h3 className={`text-2xl font-bold mb-4 ${isPlanSelected(plan.id) ? 'text-blue-600' : 'text-gray-900'}`}>
                {plan.name}
              </h3>
              <div className="mb-6">
                <span className={`text-4xl font-bold ${isPlanSelected(plan.id) ? 'text-blue-600' : 'text-gray-900'}`}>
                  {plan.price}
                </span>
                <span className="text-gray-600">{plan.period}</span>
              </div>
              <button className={`w-full py-3 rounded-lg mb-6 font-semibold transition duration-300 ${
                isPlanSelected(plan.id)
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}>
                {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
              </button>
              <ul className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <svg className={`w-5 h-5 mr-2 mt-0.5 flex-shrink-0 ${
                      isPlanSelected(plan.id) ? 'text-blue-500' : 'text-green-500'
                    }`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className={`${isPlanSelected(plan.id) ? 'text-gray-800' : 'text-gray-700'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Compare All Features</h2>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-blue-900">Feature</th>
                    <th className="px-4 py-4 text-center text-sm font-medium text-blue-900">Free</th>
                    <th className="px-4 py-4 text-center text-sm font-medium text-blue-900">Premium</th>
                    <th className="px-4 py-4 text-center text-sm font-medium text-blue-900">Dev Enterprise</th>
                    <th className="px-4 py-4 text-center text-sm font-medium text-blue-900">Starter</th>
                    <th className="px-4 py-4 text-center text-sm font-medium text-blue-900">Professional</th>
                    <th className="px-4 py-4 text-center text-sm font-medium text-blue-900">Rec Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {comparisonData.map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{row.feature}</td>
                      <td className="px-4 py-4 text-center text-sm">
                        {row.free === 'Yes' ? (
                          <svg className="w-5 h-5 text-blue-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center text-sm">
                        {row.premium === 'Yes' ? (
                          <svg className="w-5 h-5 text-blue-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center text-sm">
                        {row.devEnterprise === 'Yes' ? (
                          <svg className="w-5 h-5 text-blue-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center text-sm">
                        {row.starter === 'Yes' ? (
                          <svg className="w-5 h-5 text-blue-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center text-sm">
                        {row.professional === 'Yes' ? (
                          <svg className="w-5 h-5 text-blue-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center text-sm">
                        {row.recEnterprise === 'Yes' ? (
                          <svg className="w-5 h-5 text-blue-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <button className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 font-semibold transition duration-300">
              View Full Comparison
            </button>
          </div>
          
          <p className="text-center text-gray-600 mt-4">
            Pricing is subject to change. See our terms of service for more details.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;