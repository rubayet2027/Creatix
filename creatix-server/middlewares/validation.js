// Input validation middleware using express-validator patterns
export const validateRequest = (schema) => {
    return async (req, res, next) => {
        try {
            // Validate body
            if (schema.body) {
                const errors = await validateFields(req.body, schema.body);
                if (errors.length > 0) {
                    return res.status(400).json({
                        message: 'Validation failed',
                        errors
                    });
                }
            }

            // Validate params
            if (schema.params) {
                const errors = await validateFields(req.params, schema.params);
                if (errors.length > 0) {
                    return res.status(400).json({
                        message: 'Validation failed',
                        errors
                    });
                }
            }

            // Validate query
            if (schema.query) {
                const errors = await validateFields(req.query, schema.query);
                if (errors.length > 0) {
                    return res.status(400).json({
                        message: 'Validation failed',
                        errors
                    });
                }
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

const validateFields = (data, rules) => {
    const errors = [];

    for (const [field, validators] of Object.entries(rules)) {
        const value = data[field];

        if (validators.required && (value === undefined || value === null || value === '')) {
            errors.push({ field, message: `${field} is required` });
            continue;
        }

        if (value !== undefined && value !== null) {
            if (validators.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                errors.push({ field, message: `${field} must be a valid email` });
            }

            if (validators.type === 'number' && isNaN(Number(value))) {
                errors.push({ field, message: `${field} must be a number` });
            }

            if (validators.min !== undefined && Number(value) < validators.min) {
                errors.push({ field, message: `${field} must be at least ${validators.min}` });
            }

            if (validators.max !== undefined && Number(value) > validators.max) {
                errors.push({ field, message: `${field} must be at most ${validators.max}` });
            }

            if (validators.minLength !== undefined && value.length < validators.minLength) {
                errors.push({ field, message: `${field} must be at least ${validators.minLength} characters` });
            }

            if (validators.maxLength !== undefined && value.length > validators.maxLength) {
                errors.push({ field, message: `${field} must be at most ${validators.maxLength} characters` });
            }

            if (validators.enum && !validators.enum.includes(value)) {
                errors.push({ field, message: `${field} must be one of: ${validators.enum.join(', ')}` });
            }
        }
    }

    return errors;
};

// Common validation schemas
export const schemas = {
    createContest: {
        body: {
            name: { required: true, minLength: 3, maxLength: 100 },
            type: { required: true, enum: ['image', 'article', 'marketing', 'design', 'coding', 'other'] },
            price: { required: true, type: 'number', min: 0 },
            prizeMoney: { required: true, type: 'number', min: 0 },
            description: { required: true, minLength: 10 },
            deadline: { required: true },
        }
    },
    updateUser: {
        body: {
            name: { minLength: 2, maxLength: 50 },
            email: { type: 'email' },
        }
    },
    createSubmission: {
        body: {
            contestId: { required: true },
            taskSubmission: { required: true, minLength: 10 },
        }
    }
};

export default { validateRequest, schemas };
