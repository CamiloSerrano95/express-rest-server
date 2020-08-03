const jwt = require('jsonwebtoken');

let validateToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                status: false,
                error: {
                    message: 'Token no valido'
                }
            });
        }

        req.user = decoded.user;
        next();
    })
};

let validateAdminRol = (req, res, next) => {
    let user = req.user;

    if (user.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            status: false,
            error: {
                message: 'Debe ser un usuario administrador'
            }
        });
    }
}

module.exports = {
    validateToken,
    validateAdminRol
}