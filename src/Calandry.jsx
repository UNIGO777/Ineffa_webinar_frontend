import React, { useEffect } from 'react';

function Calandly() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Schedule a Meeting</h2>
      <div
        className="calendly-inline-widget"
        data-url="https://calendly.com/naman13399/30min"
        style={{ minWidth: '320px', height: '630px' }}
      ></div>
    </div>
  );
}

export default Calandly;
