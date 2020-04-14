"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = (req, res, error, done) => {
    error.toJSON = () => {
        return {
            message: error.message
        };
    };
    switch (error.name) {
        case 'MongoError':
            if (error.code === 1100) {
                error.statusCode = 400;
            }
            break;
        case 'ValidationError':
            error.statusCode = 400;
            /* corpo do código para versões anteriores que não tinha tratamento de erro a erro, aparecia sempre o primeiro erro
            
            const messages: any[] = []
            for (let e in error.errors) {
              messages.push({ message: error.errors[e].message })
            }
            error.toJSON = () => {
              errors: messages
            }
            
            */
            break;
    }
    done();
};
