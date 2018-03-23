const populate = require('./modules/populate')
const query = require('./modules/query')
const restify = require('restify')
const server = restify.createServer()

const status = {
	'ok': 200,
	'created': 201,
	'noContent': 204,
	'notModified': 304,
	'badRequest': 400,
	'unauthorised': 401,
	'notFound': 404
}

const defaultPort = 8081

server.get('/populate', function(req, res) {
	populate.addCars( (err, response) => {
		res.setHeader('content-type', 'application/json')
		res.setHeader('accepts', 'GET')
		if (err) {
			res.send(status.badRequest, {
				error: err.message
			})
		} else {
			res.send(status.ok, response)
		}
		res.end()
	})
})

server.get('/suv', function(req, res) {
	query.getSuv( (err, response) => {
		res.setHeader('content-type', 'application/json')
		res.setHeader('accepts', 'GET')
		if (err) {
			res.send(status.badRequest, {
				error: err.message
			})
		} else {
			res.send(status.ok, response)
		}
		res.end()
	})
})

const port = process.env.PORT || defaultPort

server.listen(port, err => {
	if (err) {
		console.error(err)
	} else {
		console.log('App is ready at : ' + port)
	}
})
