export default function errorHandler(err, req, res, _next){
    console.log(err)
    res.status(500).json({ error: 'Internal Server Error' })

}