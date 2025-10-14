// Regex Validators for Campus Life Planner

export const validators = {
    // Title: forbid leading/trailing spaces and collapse doubles
    title: {
        regex: /^\S(?:.*\S)?$/,
        message: "Title cannot have leading/trailing spaces or be empty"
    },

    // Duration: numeric field
    duration: {
        regex: /^(0|[1-9]\d*)$/,
        message: "Duration must be a valid non-negative number"
    },

    // Date: YYYY-MM-DD format
    date: {
        regex: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
        message: "Date must be in YYYY-MM-DD format"
    },

    // Tag: letters, spaces, hyphens
    tag: {
        regex: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,
        message: "Tag can only contain letters, spaces, and hyphens"
    },

    // Advanced: Duplicate word detection (back-reference)
    duplicateWord: {
        regex: /\b(\w+)\s+\1\b/i,
        message: "Contains duplicate consecutive words"
    },

    // Advanced: Time token detection (HH:MM format)
    timeToken: {
        regex: /\b\d{2}:\d{2}\b/,
        message: "Contains time token"
    }
};

export function validateField(fieldName, value) {
    const validator = validators[fieldName];
    if (!validator) return { valid: true };

    const valid = validator.regex.test(value);
    return {
        valid,
        message: valid ? '' : validator.message
    };
}

export function validateTask(task) {
    const errors = {};
    const warnings = [];

    const titleValidation = validateField('title', task.title);
    if (!titleValidation.valid) {
        errors.title = titleValidation.message;
    }

    // Advanced: Check for duplicate words in title (back-reference)
    if (validators.duplicateWord.regex.test(task.title)) {
        warnings.push('Title contains duplicate words');
    }

    // Advanced: Check for time tokens in title
    if (validators.timeToken.regex.test(task.title)) {
        warnings.push('Title contains time pattern (HH:MM format)');
    }

    const dateValidation = validateField('date', task.dueDate);
    if (!dateValidation.valid) {
        errors.dueDate = dateValidation.message;
    }

    const durationValidation = validateField('duration', task.duration.toString());
    if (!durationValidation.valid) {
        errors.duration = durationValidation.message;
    }

    const tagValidation = validateField('tag', task.tag);
    if (!tagValidation.valid) {
        errors.tag = tagValidation.message;
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors,
        warnings
    };
}

export function createRegexFromPattern(pattern, flags = '') {
    try {
        return new RegExp(pattern, flags);
    } catch (e) {
        throw new Error('Invalid regex pattern');
    }
}
