import 'setimmediate'
import cloudinary from 'cloudinary'
import axios from 'axios'
import uploadImage from '@/modules/daybook/helpers/uploadImage'

cloudinary.config({
    cloud_name: 'dsvsl0b0b',
    api_key: '725288349447336',
    api_secret: 'yE8HujoLEJezgddssetQUQTVybw'
})
describe('Pruebas en el uploadImage', () => {
    test('debe de cargar un archivo y retornar el url', async (done) => {
        const { data } = await axios.get('https://res.cloudinary.com/dsvsl0b0b/image/upload/v1653346900/uu4crmvkmv2tk3ntze9y.jpg', {
            responseType: 'arraybuffer'
        })
        const file = new File([data], 'foto.jpg')
        const url = await uploadImage(file)
        expect(typeof url).toBe('string')

        //Tomar el ID de la imagen
        const segments = url.split('/')
        const imageId = segments[segments.length - 1].replace('.jpg', '')
        cloudinary.v2.api.delete_resources(imageId, {}, () => {
            done()
        })
    })
})