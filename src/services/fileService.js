import axios from 'axios';

export class FileService {

    API_URL = 'http://localhost:8080/';


    getAll() {
        console.log(axios.get(this.API_URL + 'map').then(res => res.data));

        return axios.get(this.API_URL + 'map').then(res => res.data) ;
        
    }
    delete(id) {
        return axios.delete(this.API_URL + 'delete/' + id).then(res => res.data);

    }

    descargarPDF(id) {
        let enlace = this.API_URL + 'downloadFile/' + id;
        return axios.get(enlace, {
            responseType: 'blob',
        });
    }

    save(bodyFormData) {
        return axios.post(this.API_URL + 'uploadFile', bodyFormData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    }
}
export default new FileService();