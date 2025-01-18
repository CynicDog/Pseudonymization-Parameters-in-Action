// 원하는 배수로 반올림된 숫자를 반환
export const applyMRounding = (value, interval) => {
    return Math.round(value / interval) * interval; // 데이터를 구간에 맞게 반올림
};

// 텍스트 마스킹을 적용하는 함수
export const applyMasking = (originalText, specifier, replacement) => {
    if (!specifier) return originalText; // 지정자가 없으면 원본 텍스트 그대로 반환

    const textLength = originalText.length;

    // Case 1: 정규 표현식 (예: /\d{3}/ -> 숫자 중 첫 3자리를 마스킹)
    try {
        if (/\/.*\//.test(specifier)) {
            const regexString = specifier.slice(1, specifier.lastIndexOf('/'));
            const flags = specifier.slice(specifier.lastIndexOf('/') + 1);
            const regex = new RegExp(regexString, flags);
            return originalText.replace(regex, (match) => replacement.repeat(match.length));
        }
    } catch (e) {
        console.log("잘못된 정규식:", e);
    }

    // Case 2: 양의 정수 (예: "2" -> 첫 2문자를 마스킹)
    if (/^\d+$/.test(specifier)) {
        const length = Math.min(Number(specifier), textLength); // 텍스트 길이를 초과하지 않도록 제한
        return replacement.repeat(length) + originalText.slice(length);
    }

    // Case 3: 음의 정수 (예: "-2" -> 마지막 2문자를 마스킹)
    if (/^-\d+$/.test(specifier)) {
        const length = Math.min(Math.abs(Number(specifier)), textLength); // 텍스트 길이를 초과하지 않도록 제한
        return originalText.slice(0, textLength - length) + replacement.repeat(length);
    }

    // Case 4: 범위 (예: "2:4" -> 인덱스 2부터 4까지 마스킹)
    if (/^\d+:\d+$/.test(specifier)) {
        const [start, end] = specifier.split(':').map(Number);

        // 시작과 끝 인덱스가 유효한 범위 내에 있도록 제한
        const validStart = Math.min(Math.max(start, 0), textLength);
        const validEnd = Math.min(Math.max(end, validStart), textLength);

        if (validStart < validEnd) {
            const maskedStart = originalText.slice(0, validStart);
            const maskedRange = replacement.repeat(validEnd - validStart);
            const maskedEnd = originalText.slice(validEnd);
            return maskedStart + maskedRange + maskedEnd;
        }
    }

    // Case 5: 날짜 형식 마스킹 (예: "dd" -> 날짜 부분 마스킹)
    if (specifier === 'dd' && /\d{4}-\d{2}-\d{2}/.test(originalText)) {
        return originalText.slice(0, 8) + replacement.repeat(2);
    }
    if (specifier === 'mm' && /\d{4}-\d{2}-\d{2}/.test(originalText)) {
        return originalText.slice(0, 5) + replacement.repeat(2) + originalText.slice(7);
    }
    if (specifier === 'yyyy' && /\d{4}-\d{2}-\d{2}/.test(originalText)) {
        return replacement.repeat(4) + originalText.slice(4);
    }
    if (specifier === 'yyyy-mm' && /\d{4}-\d{2}/.test(originalText)) {
        return replacement.repeat(4) + '-**' + originalText.slice(7);
    }
    if (specifier === 'yyyy-dd' && /\d{4}-\d{2}-\d{2}/.test(originalText)) {
        return replacement.repeat(4) + '-' + originalText.slice(5, 8) + replacement.repeat(2);
    }
    if (specifier === 'mm-dd' && /\d{4}-\d{2}-\d{2}/.test(originalText)) {
        return originalText.slice(0, 5) + replacement.repeat(2) + '-' + replacement.repeat(2);
    }
    if (specifier === 'yyyy-mm-dd' && /\d{4}-\d{2}-\d{2}/.test(originalText)) {
        return replacement.repeat(4) + '-**-**';
    }

    // 기본값: 지정자 형식이 인식되지 않으면 원본 텍스트 그대로 반환
    return originalText;
};