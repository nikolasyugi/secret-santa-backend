module.exports = () => {
    return {

        throwError: (err, res) => {
            let msgCustomized;

            //Mongoose errors
            switch (err.name) {
                case ("DocumentNotFoundError"):
                    err.status = 404;
                    msgCustomized = "Não encontrado";
                    break;
                case ("ValidationError"):
                    msgCustomized = `Campo ${Object.keys(err.errors)[0]} inválido`;
                    break;
            }
            res.status(err.status || 500);
            return res.json({ message: msgCustomized || err.message });
        },

        routeNotFound: (next) => {
            const err = new Error("Rota não encontrada");
            err.status = 404;
            next(err);
        },

        handle: (promise) => {
            return promise
                .then(data => ([data, undefined]))
                .catch(error => Promise.resolve([undefined, error]));
        },

    }
}