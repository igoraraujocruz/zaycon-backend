import { serverHttp } from './http';

serverHttp.listen(3333, () => {
    console.log('Server started on port 3333')
})