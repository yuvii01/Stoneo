import React from "react";

const CEOQuote = () => {
  return (
    <>
      <style>{`
        .ceo-section {
          background-color: #f5ede4;
          padding: 60px 40px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .ceo-card {
          display: flex;
          align-items: center;
          gap: 60px;
          max-width: 1000px;
          width: 100%;
        }

        /* ── Portrait ── */
        .ceo-portrait {
          flex-shrink: 0;
          width: 220px;
          height: 220px;
          border-radius: 50%;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
        }
        .ceo-portrait img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          filter: grayscale(100%);
          display: block;
        }

        /* ── Placeholder shown until image is added ── */
        .ceo-portrait-placeholder {
          width: 100%;
          height: 100%;
          background: #d9cfc8;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9e9189;
          font-size: 13px;
          text-align: center;
          padding: 12px;
          box-sizing: border-box;
        }

        /* ── Quote side ── */
        .ceo-content {
          flex: 1;
        }

        .ceo-quote-text {
          font-size: 18px;
          line-height: 1.75;
          color: #4a4440;
          margin: 0 0 28px 0;
          font-style: normal;
        }

        .ceo-attribution {
          text-align: right;
        }

        .ceo-name {
          font-size: 17px;
          font-weight: 600;
          color: #3a3330;
          display: block;
          margin-bottom: 2px;
        }

        .ceo-title {
          font-size: 14px;
          color: #7a706a;
          display: block;
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .ceo-section {
            padding: 36px 20px;
          }
          .ceo-card {
            gap: 24px;
          }
          .ceo-portrait {
            width: 120px;
            height: 120px;
            flex-shrink: 0;
          }
          .ceo-quote-text {
            font-size: 13px;
            line-height: 1.6;
            margin-bottom: 16px;
          }
          .ceo-name {
            font-size: 13px;
          }
          .ceo-title {
            font-size: 12px;
          }
        }
      `}</style>

      <section className="ceo-section">
        <div className="ceo-card">

          <div className="ceo-portrait">
            
            <div className="ceo-portrait-placeholder">
              <img src="/kamalji.png" alt="Mr. Kamal Maheshwari" />
            </div>
          </div>

          {/* Quote + attribution */}
          <div className="ceo-content">
            <p className="ceo-quote-text">
              "Our motto is to supply good quality Indian granite at reasonable
              price to our customers and extend prompt and efficient services
              and attention."
            </p>
            <div className="ceo-attribution">
              <span className="ceo-name">Mr. Kamal Maheshwari</span>
              <span className="ceo-title">(CEO)</span>
            </div>
          </div>

        </div>
      </section>
    </>
  );
};

export default CEOQuote;