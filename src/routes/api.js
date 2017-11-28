import Router from 'koa-router'
import textController from '../controllers/textController'
import userController from '../controllers/userController'

const router = new Router
router.get('/', ctx => {
  ctx.body = {status: 'success'}
})
router.post('/user', userController.register)
router.post('/user/:username/token', userController.getToken)
router.get('/user/:username', userController.index)
router.post('/user/:username/text', textController.create)
router.get('/user/:username/text', textController.getAll)
router.put('/user/:username/text/:name', textController.update)
router.get('/user/:username/text/:name', textController.get)
router.delete('/user/:username/text/:name', textController.delete)

export default router
