export default {
    registration: {
        response: {
            default: {
                type: 'object',
                properties: {
                    message: {
                        type: 'string',
                    },
                    status: {
                        type: 'string',
                        default: 'error'
                    }
                }
            },
            200: {
                type: 'object',
                properties: {
                    token: {
                        type: 'string',
                    },
                },
            },
            500: {
                type: 'object',
                properties: {
                    text: {
                        type: 'string',
                    },
                    status: {
                        type: 'string',
                        default: 'error'
                    }
                }
            },
        },
        body: {
            type: 'object',
            properties: {
                username: {
                    type: 'string',
                    minLength: 3,
                    maxLength: 20,
                },
                password: {
                    type: 'string',
                    minLength: 5,
                    maxLength: 64,
                },
                email: {
                    type: 'string',
                    minLength: 5,
                    maxLength: 20,
                },
            },
            required: ['username', 'password', 'email'],
        }
    },
    login: {
        response: {
            default: {
                type: 'object',
                properties: {
                    message: {
                        type: 'string',
                    },
                    status: {
                        type: 'string',
                        default: 'error'
                    }
                }
            },
            200: {
                type: 'object',
                properties: {
                    token: {
                        type: 'string',
                    },
                    status: {
                        type: 'string',
                        default: 'success'
                    }
                },
            },
            401: {
                type: 'object',
                properties: {
                    text: {
                        type: 'string',
                    },
                    code: {
                        type: 'string',
                    },
                    status: {
                        type: 'string',
                        default: 'error'
                    }
                }
            },
        },
        body: {
            type: 'object',
            properties: {
                username: {
                    type: 'string',
                    minLength: 3,
                    maxLength: 20,
                },
                password: {
                    type: 'string',
                    minLength: 5,
                    maxLength: 64,
                },
                typeAuth: {
                    type: 'string',
                }
            },
            required: ['username', 'password', 'typeAuth'],
        }
    }
}