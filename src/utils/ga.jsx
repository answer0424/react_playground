// src/utils/ga.js
export const GA_TRACKING_ID = "G-RWD9ZLZLM0"; // 측정 ID

// 페이지뷰 추적
export const pageview = (url) => {
    window.gtag("config", GA_TRACKING_ID, {
        page_path: url,
    });
};

// 커스텀 이벤트
export const event = ({ action, screenName, userId }) => {
    window.gtag("event", action, {
        screen_name: screenName,
        user_id: userId,
        timestamp: new Date().toISOString(),
    });
};
