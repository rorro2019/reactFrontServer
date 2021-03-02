import React, { Fragment } from 'react';

import { Toast } from 'primereact/toast';
import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import { Panel } from 'primereact/panel';
import axios from 'axios';
import { FileService } from "../services/fileService";
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './DataTableDemo.css';

export class Upload extends React.Component {
    constructor() {
        super();

        this.state = {
            visible: false,
            request: {
                id: null,
                comentario: '',
                producto: '',
                tipoDni: null,
                dni: null
            },
            file: null,
            globalFilter: null,
            selectedFile: {
            },
            file: {
                id: null,
                fileName: null,
                fileType: null,
                tipoDni: null,
                dni: null,
                cuil: null,
                producto: null,
                idProducto: null,
                comentario: null,
                version: null,
                data: null
            }

        };
        this.items = [
            {
                label: 'Nuevo',
                icon: 'pi pi-fw pi-plus',
                command: () => { this.showSaveDialog() }
            },
            {
                label: 'Editar',
                icon: 'pi pi-fw pi-pencil',
                command: () => { this.showEditDialog(this.state.selectedFile.id) }
            },
            {
                label: 'Eliminar',
                icon: 'pi pi-fw pi-trash',
                command: () => { this.showConfirm(this.state.selectedFile.id) }
            },
            {
                label: 'Descargar PDF',
                icon: 'pi pi-fw pi-file-pdf',
                command: () => { this.descargarPDF(this.state.selectedFile.id) }
            }

        ];

        this.itemmm = (
        
            <div>
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2"
            onClick={() => this.showEditDialog(this.state.selectedFile.id)} />
           <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" 
           onClick={() => this.showConfirm(this.state.selectedFile.id) } />
        <Button icon="pi pi-fw pi-file-pdf" className="p-button-rounded p-button-danger" 
           onClick={() => this.descargarPDF(this.state.selectedFile.id) } />
           </div>
        );
        this.fileService = new FileService();
        
        this.footer = (
            <div>
                <Button label="Guardar"
                    icon="pi pi-check" onClick={e => this.handleSubmit(e)} />
            </div>
        ) ;


    }

    handleFile = (e) => {
        this.setState({
            file: e.target.files[0]
        })
    }
   
    componentDidMount() {
        this.fileService.getAll().then(data => this.setState({ files: data }))
        
    }

    delete() {
        this.fileService.delete(this.state.selectedFile.id).then(data => {
            this.toast.show({ severity: 'success', summary: 'Atención!', detail: 'Se eliminó el registro correctamente.' });
            this.componentDidMount();

        }).catch(error => {
            this.toast.show({ life: 5000, severity: 'error', summary: 'Error!', detail: 'Ocurrio un error al eliminar el registro.' });
            this.componentDidMount();
        });
        this.clear();
    }
    clear() {
        this.toast.clear();
    }

    descargarPDF(id) {
        if (id == null) {
            this.toast.show({ life: 5000, severity: 'error', summary: 'Error!', detail: 'No selecciono ningun registro a descargar.' });
            this.componentDidMount();
        } else {
            this.fileService.descargarPDF(id).then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]))
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', this.state.selectedFile.fileName)
                document.body.appendChild(link)
                link.click();
                this.toast.show({ severity: 'success', summary: 'Atención!', detail: 'Se descargo correctamente.' });
                this.componentDidMount();
            }).catch(error => {
                console.log(error);
            }).catch(error => {
                this.toast.show({ life: 5000, severity: 'error', summary: 'Error!', detail: 'Ocurrio un error al descargar el PDF.' });
                this.componentDidMount();
            });
        }

    }


    comentarioBodyTemplate(rowData) {
        return (
            <React.Fragment>
                <span className="p-column-title">Comentario</span>
                {rowData.comentario}
            </React.Fragment>
        );
    }
    tipoDniBodyTemplate(rowData) {
        return (
            <React.Fragment>
                <span className="p-column-title">Tipo DNI</span>
                {rowData.tipoDni}
            </React.Fragment>
        );
    }
    dniBodyTemplate(rowData) {
        return (
            <React.Fragment>
                <span className="p-column-title">DNI</span>
                {rowData.dni}
            </React.Fragment>
        );
    }
    productoBodyTemplate(rowData) {
        return (
            <React.Fragment>
                <span className="p-column-title">Producto</span>
                {rowData.producto}
            </React.Fragment>
        );
    }
    fileNameBodyTemplate(rowData) {
        return (
            <React.Fragment>
                <span className="p-column-title">Nombre de archivo</span>
                {rowData.fileName}
            </React.Fragment>
        );
    }
    showConfirm(id) {
        if (id == null) {
            this.toast.show({ life: 5000, severity: 'error', summary: 'Error!', detail: 'No selecciono ningun registro a eliminar.' });
            this.componentDidMount();
        } else {
            this.toast.show({
                life: 5000, severity: 'warn', sticky: true, content: (
                    <div className="p-flex p-flex-column" style={{ flex: '1' }}>
                        <div className="p-text-center">
                            <i className="pi pi-exclamation-triangle" style={{ fontSize: '3rem' }}></i>
                            <h4>¿Realmente desea eliminar el registro?</h4>
                            <p>Confirmar la eliminacion</p>
                        </div>
                        <div className="p-grid p-fluid">
                            <div className="p-col-6">
                                <Button type="button" label="Si" className="p-button-success"
                                    onClick={e => this.delete(id)} />
                            </div>
                            <br />
                            <div className="p-col-6">
                                <Button type="button" label="No" className="p-button-secondary" onClick={e => this.clear()} />
                            </div>
                        </div>
                    </div>
                )
            });
        }
    }

    handleSubmit = (e) => {

        if ((this.state.request.dni == null) || (this.state.request.tipoDni == null) || (this.state.request.producto == null)
            || (this.state.file == null)) {
            this.toast.show({ life: 5000, severity: 'error', summary: 'Error!', detail: 'No completo todos los campos.' });
            this.componentDidMount();
        } else {
            var bodyFormData = new FormData();
            bodyFormData.set('file', this.state.file);
            bodyFormData.set('request', JSON.stringify(this.state.request));
            this.fileService.save(bodyFormData)
                .then(resp => {
                    this.setState({
                        visible: false,
                        request: {
                            comentario: '',
                            producto: '',
                            tipoDni: 0,
                            dni: 0
                        },
                        file: null
                    });
                    this.toast.show({ life: 5000, severity: 'success', summary: 'Atención!', detail: 'Se guardó el registro correctamente.' });
                    this.componentDidMount();
                }).catch(error => {
                    this.setState({
                        visible: false,
                        request: {
                            comentario: '',
                            producto: '',
                            tipoDni: 0,
                            dni: 0
                        },
                        file: null
                    });
                    this.toast.show({ life: 5000, severity: 'error', summary: 'Error!', detail: 'Ocurrio un error al guardar registro.' });
                    this.componentDidMount();
                });
        }
    }

    showSaveDialog() {
        this.setState({
            visible: true,
            request: {
                comentario: '',
                producto: '',
                tipoDni: null,
                dni: null
            },
            file: null
        });

    }
    showEditDialog = function(id) {
        if ( this.state.selectedFile.id == null) {
            this.toast.show({ life: 5000, severity: 'error', summary: 'Error!', detail: 'No selecciono ningun registro a editar.' });
            this.componentDidMount();
        } else {
            this.setState({

                visible: true,
                request: {
                    id: this.state.selectedFile.id,
                    comentario: this.state.selectedFile.comentario,
                    producto: this.state.selectedFile.producto,
                    tipoDni: this.state.selectedFile.tipoDni,
                    dni: this.state.selectedFile.dni
                },
                file: this.state.selectedFile.file

            })
        }

    }


    actionBodyTemplate(rowData) {
 
        return (

            <React.Fragment  >
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2"
                    onClick={() => this.showEditDialog(this)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning"
                    onClick={() => this.showEditDialog(this)} />
                <Button icon="pi pi-fw pi-file-pdf" className="p-button-rounded p-button-danger"
                    onClick={() => this.showEditDialog(this)} />
            </React.Fragment>
        );
    }



    render() {
        return (

            <div className="container mt-4">
                <div className="mb-2">
                    <Menubar model={this.items} />
                </div>
                <Panel header="Vista de archivos">
                    <div className="datatable-responsive-demo">
                        <div className="card">
                            <DataTable value={this.state.files} paginator={true} rows="10" selectionMode="single"
                                className="p-datatable-responsive-demo"
                                selection={this.state.selectedFile}
                                onSelectionChange={e => this.setState({ selectedFile: e.value })}
                                ref={(el) => { this.dt = el; }} >
                                <Column field="fileName" header="Nombre de documento"
                                body={this.fileNameBodyTemplate} filter filterPlaceholder="Buscar por documento" > </Column>
                                <Column field="dni" header="DNI" body={this.dniBodyTemplate} filter filterPlaceholder="Buscar por DNI" ></Column>
                                <Column field="tipoDni" header="Tipo Dni" body={this.tipoDniBodyTemplate} filter filterPlaceholder="Buscar por tipo Dni"></Column>
                                <Column field="producto" header="Producto" body={this.productoBodyTemplate} filter filterPlaceholder="Buscar por producto"></Column>
                                <Column field="comentario" header="Comentario"  ></Column>
                            </DataTable>
                        </div></div>
                </Panel>

                <Dialog header="Registrar Nuevo Documento" visible={this.state.visible} style={{ width: '600px' }}
                    footer={this.footer} modal={true} onHide={() => this.setState({ visible: false })}>

                    <div className="form-group">

                        <div className="card card-container p-4">


                            <div className="form-row">
                                <div className="form-group col-md-2">
                                    <label htmlFor="tipoDni">Tipo DNI</label>

                                    <InputText value={this.state.request.tipoDni} type="number"
                                        max="2" style={{ width: '100%' }} id="tipoDni"
                                        onChange={(e) => {
                                            let val = e.target.value;
                                            this.setState(prevState => {
                                                let request = Object.assign({}, prevState.request);
                                                request.tipoDni = parseInt(val, 10);
                                                console.log(request);
                                                return { request };
                                            })
                                        }
                                        } />
                                </div>

                                <div className="form-group col-md-5">
                                    <label htmlFor="dni">DNI</label>

                                    <InputText value={this.state.request.dni} type="number"
                                        max="11"
                                        style={{ width: '100%' }} id="dni" onChange={(e) => {
                                            let val = e.target.value;
                                            this.setState(prevState => {
                                                let request = Object.assign({}, prevState.request);
                                                request.dni = parseInt(val, 10);
                                                console.log(request);
                                                return { request };
                                            })
                                        }
                                        } />
                                </div>


                                <div className="form-group col-md-2">
                                    <label for="inputState">Producto</label>
                                    <select id="producto" value={this.state.request.producto} options={this.state.productos}
                                        className="form-control"
                                        onChange={(e) => {
                                            let val = e.target.value;
                                            this.setState(prevState => {
                                                let request = Object.assign({}, prevState.request);
                                                request.producto = val;
                                                return { request };
                                            })
                                        }}>
                                        <option selected></option>
                                        <option>AC</option>
                                        <option>TC</option>
                                        <option>PR</option>
                                        <option>CC</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group col-md-8">
                                    <label htmlFor="username">Archivo</label>
                                    <InputText name='file' type="file"
                                        multiple={false}
                                        accept=".pdf"
                                        onChange={e => this.handleFile(e)} />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-9">
                                    <label htmlFor="comentario">Comentario</label>

                                    <InputText value={this.state.request.comentario} style={{ width: '100%' }} id="comentario"
                                        onChange={(e) => {
                                            let val = e.target.value;
                                            this.setState(prevState => {
                                                let request = Object.assign({}, prevState.request);
                                                request.comentario = val;
                                                return { request };
                                            })
                                        }
                                        } />

                                </div>
                            </div>
                            {/* <input name='category' placeholder='category' onChange={e => this.handleChange(e)}></input> */}



                        </div>
                    </div>
                </Dialog>
                <Toast ref={(el) => this.toast = el} />
            </div>

        )
    }








}