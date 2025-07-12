import React from 'react';

export default function TipsSection() {
  const tips = [
    {
      title: 'Crafting a Strong Profile',
      description: 'Clearly define your goals, experience, and interests to stand out and attract meaningful connections.',
    },
    {
      title: 'Effective Communication',
      description: 'Be concise, professional, and transparent when discussing opportunities or sharing updates.',
    },
    {
      title: 'Building Long-Term Relationships',
      description: 'Whether you’re investing or seeking investment, focus on trust, alignment, and mutual growth.',
    },
    {
      title: 'Stay Updated & Curious',
      description: 'Keep learning about industry trends, startup success stories, and innovation strategies.',
    },
  ];

  return (
    <div className="bg-light text-dark py-5 mt-4">
      <div className="container">
        <h3 className="text-center fw-bold mb-4">💡 Tips & Insights</h3>
        <div className="row">
          {tips.map((tip, index) => (
            <div className="col-md-6 col-lg-3 mb-4" key={index}>
              <div className="card h-100 shadow-sm border-0 bg-white">
                <div className="card-body">
                  <h5 className="card-title fw-semibold text-primary">{tip.title}</h5>
                  <p className="card-text">{tip.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
