import './tabelas.css';
import { useEffect, useRef, useState } from "react";
import App from "../../../application/App";
import tabelasService from "../../../services/administracao/tabelas.service";
import { Button, FlexboxGrid, Form, IconButton, Modal, Nav, Navbar, Pagination, Table, SelectPicker, Schema, useToaster, Message, Loader, Stack } from "rsuite";
import { FiDelete, FiEdit, FiRefreshCw } from 'react-icons/fi';
import { FaPlus } from 'react-icons/fa';
import FormGroup from 'rsuite/esm/FormGroup';




export default function Tabelas() {
    const [page, setPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [noData, setNoData] = useState(false);
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const selecTipoTabela = [{ label: 'Cadastro', value: 'bott_MasterData' }, { label: 'Linha Cadastro', value: 'bott_MasterDataLines' }, { label: 'Documento', value: 'bott_Document' }, { label: 'Linha Documento', value: 'bott_DocumentLines' }, { label: 'Sem Objeto', value: 'bott_NoObject' }, { label: 'Nenhum Objeto com Auto Incremento', value: 'bott_NoObjectAutoIncrement' }].map((item) => { return { label: item.label, value: item.value } });
    const model = Schema.Model({
        TableName: Schema.Types.StringType().isRequired('Campo Obrigatório'),
        TableType: Schema.Types.StringType().isRequired('Campo Obrigatório'),
        TableDescription: Schema.Types.StringType().isRequired('Campo Obrigatório'),
    });
    const [formValue, setFormValue] = useState({
        TableName: '',
        TableType: '',
        TableDescription: '',
    });
    const formRef = useRef();
    const [formError, setFormError] = useState({});
    const toaster = useToaster();


    useEffect(() => {
        tabelasService.getTabelas().then((response) => {
            if (response.data.length === 0)
                setNoData(true);
            else
                setData(response.data);

            setTotalRecords(parseInt(response.count));
        });

    }, []);

    const TipoCell = ({ rowData, dataKey, ...props }) => {
        let tipo = '';
        switch (rowData[dataKey]) {
            case 'bott_MasterData':
                tipo = 'Cadastro'
                break;
            case 'bott_MasterDataLines':
                tipo = 'Linha Cadastro'
                break;
            case 'bott_Document':
                tipo = 'Documento'
                break;
            case 'bott_DocumentLines':
                tipo = 'Linha Documento'
                break;
            case 'bott_NoObject':
                tipo = 'Sem Objeto'
                break;
            case 'bott_NoObjectAutoIncrement':
                tipo = 'Nenhum Objeto com Auto Incremento'
                break;
            default:
                tipo = rowData[dataKey];
                break;

        }
        return (
            <Table.Cell {...props} >
                {tipo}
            </Table.Cell>
        );
    };

    const ActionCell = ({ rowData, dataKey, ...props }) => {

        return (
            <Table.Cell {...props} align='center' >
                <IconButton size="lg" color='yellow' appearance="subtle" icon={<FiEdit />} onClick={() => atualizaTabela(rowData)} />
                <IconButton size="lg" color='red' appearance="subtle" icon={<FiDelete />} onClick={() => deleteTabela(rowData[dataKey])} />
            </Table.Cell>
        );
    };

    const selecionaPagina = (p) => {
        //console.log(p);
        setPage(p);
        tabelasService.nextPageCampos((p - 1) * 20).then((response) => {
            setData(response.data);
            setTotalRecords(parseInt(response.count));
            //console.log(response);
        })
    };

    const msgWarnig = (formError, funcao) => (
        <Message showIcon type='warning' duration={8000} header={`Erro ao tentar ${funcao} tabela!'`} >
            {
                Object.keys(formError).map((key) => {
                    console.log(key, formError[key]);
                    return <p>{key} - {formError[key]}</p>
                })
            }
        </Message>
    );

    const msgSuccess = (msg, funcao) => (
        <Message showIcon type='success' duration={8000} header={`Tabela ${funcao} com sucesso!`} >
            <p>{msg.TableName}</p>
        </Message>
    );

    const msgError = (msg, funcao) => (
        <Message showIcon type='error' duration={8000} header={`Erro ao tentar ${funcao} tabela!`} >
            <p>{msg}</p>
        </Message>
    );

    const handleSubmit = () => {
        if (!formRef.current.check()) {
            toaster.push(msgWarnig(formError, 'adicionar'), { placement: 'topEnd' });
            return;
        }
        //console.log(formValue, 'Form Value');
        setOpen(false);
        setLoading(true);
        tabelasService.addTabela(formValue).then((response) => {
            //console.log(response);
            if (response.status === 201) {
                toaster.push(msgSuccess(response.data, 'adicionada'), { placement: 'topEnd' });
                setFormValue({
                    TableName: '',
                    TableType: '',
                    TableDescription: '',
                });
                carregaDados();
                setLoading(false);
            } else {
                setLoading(false);
                setOpen(true);
                toaster.push(msgError(response.data, 'adicionar'), { placement: 'topEnd' });
            }


        }).catch((error) => {
            console.log(error);
        });
    };

    const handleSubmitEdit = () => {
        if (!formRef.current.check()) {
            toaster.push(msgWarnig(formError, 'atualizar'), { placement: 'topEnd' });
            return;
        }
        //console.log(formValue, 'Form Value');
        setOpenEdit(false);
        setLoading(true);
        tabelasService.updateTabela(formValue).then((response) => {
            //console.log(response);
            if (response.status === 204) {
                toaster.push(msgSuccess(response.data, 'atualizada'), { placement: 'topEnd' });
                setFormValue({
                    TableName: '',
                    TableType: '',
                    TableDescription: '',
                });
                carregaDados();
                setLoading(false);
            } else {
                setLoading(false);
                setOpenEdit(true);
                toaster.push(msgError(response.data, 'atualizar'), { placement: 'topEnd' });
            }


        }).catch((error) => {
            console.log(error);
        });
    };

    const deleteTabela = (id) => {
        setLoading(true);
        tabelasService.deleteTabela(id).then((response) => {
            if (response.status === 204) {
                toaster.push(msgSuccess(response.data), { placement: 'topEnd' });
                carregaDados();
                setLoading(false);
            } else {
                setLoading(false);
                toaster.push(msgError(response.data), { placement: 'topEnd' });
            }
        }).catch((error) => {
            setLoading(false);
            console.log(error);
        });
    };

    const atualizaTabela = (tabela) => {
        setFormValue({
            TableName: tabela.TableName,
            TableType: tabela.TableType,
            TableDescription: tabela.TableDescription,
        });
        setOpenEdit(true);
    };

    const carregaDados = () => {
        setData([]);
        tabelasService.getTabelas().then((response) => {
            if (response.data.length === 0)
                setNoData(true);
            else
                setData(response.data);

            setTotalRecords(parseInt(response.count));
        });
       
    };

    return (
        <App>
            <FlexboxGrid>
                <FlexboxGrid.Item colspan={24}>
                    <Navbar appearance="subtle">
                        <Navbar.Brand href="#"></Navbar.Brand>
                        <Nav>

                        </Nav>
                        <Nav pullRight>
                            <Nav.Item>
                                <Stack spacing={15}>
                                    <Button color="blue" appearance="primary" onClick={() => open ? setOpen(false) : setOpen(true)}>
                                        <FaPlus /> Criar Tabela
                                    </Button>

                                    <Button size="lg" appearance="link" onClick={carregaDados} >
                                        <FiRefreshCw />
                                    </Button>
                                </Stack>
                            </Nav.Item>
                        </Nav>
                    </Navbar>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item colspan={24}>
                    {
                        loading ?
                            <div>
                                {/* <Placeholder.Grid rows={15} columns={3} /> */}
                                <Loader center size="lg" content="Processando..." />
                            </div>
                            :
                            <>
                                <Table
                                    virtualized
                                    autoHeight={true}
                                    loading={data.length === 0}
                                    data={noData ? [] : data}

                                >
                                    <Table.Column flexGrow={2}>
                                        <Table.HeaderCell>Nome Tabela</Table.HeaderCell>
                                        <Table.Cell dataKey="TableName" />
                                    </Table.Column>
                                    <Table.Column flexGrow={2}>
                                        <Table.HeaderCell>Descrição Tabela</Table.HeaderCell>
                                        <Table.Cell dataKey="TableDescription" />
                                    </Table.Column>
                                    <Table.Column flexGrow={2}>
                                        <Table.HeaderCell>Tipo Tabela</Table.HeaderCell>
                                        <TipoCell dataKey="TableType" />
                                    </Table.Column>
                                    <Table.Column flexGrow={2} align='center'>
                                        <Table.HeaderCell></Table.HeaderCell>
                                        <ActionCell dataKey="TableName" />
                                    </Table.Column>
                                </Table>
                                <div style={{ padding: 20 }}>
                                    <Pagination
                                        prev
                                        next
                                        first
                                        last
                                        ellipsis
                                        boundaryLinks
                                        maxButtons={5}
                                        size="xs"
                                        layout={['total', '-', '|', 'pager']}
                                        total={totalRecords}
                                        limit={20}
                                        activePage={page}
                                        onChangePage={selecionaPagina}
                                        locale={{total: 'Total de Tabelas: {0}'}}
                                    />
                                </div>
                            </>
                    }


                </FlexboxGrid.Item>

            </FlexboxGrid>

            <Modal backdrop={'static'}
                keyboard={false}
                open={open}
                onClose={() => { setOpen(false) }}

            >
                <Modal.Header>
                    <Modal.Title>CRIAR TABELA USUÁRIO SAP</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form fluid
                        model={model}
                        formValue={formValue}
                        onChange={setFormValue}
                        ref={formRef}
                        onCheck={setFormError}

                    >
                        <FormGroup>
                            <Form.ControlLabel>Nome Tabela</Form.ControlLabel>
                            <Form.Control name="TableName" />
                        </FormGroup>
                        <FormGroup>
                            <Form.ControlLabel>Descrição Tabela</Form.ControlLabel>
                            <Form.Control name="TableDescription" />
                        </FormGroup>
                        <FormGroup >
                            <Form.ControlLabel>Tipo Tabela</Form.ControlLabel>
                            <Form.Control name="TableType" accepter={SelectPicker} data={selecTipoTabela} />
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => { setOpen(false) }}>Cancelar</Button>
                    <Button onClick={handleSubmit} appearance="primary">
                        Salvar
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal backdrop={'static'}
                keyboard={false}
                open={openEdit}
                onClose={() => { setOpenEdit(false) }}

            >
                <Modal.Header>
                    <Modal.Title>ALTERA TABELA USUÁRIO SAP</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form fluid
                        model={model}
                        formValue={formValue}
                        onChange={setFormValue}
                        ref={formRef}
                        onCheck={setFormError}

                    >
                        <FormGroup>
                            <Form.ControlLabel>Nome Tabela</Form.ControlLabel>
                            <Form.Control name="TableName" disabled />
                        </FormGroup>
                        <FormGroup>
                            <Form.ControlLabel>Descrição Tabela</Form.ControlLabel>
                            <Form.Control name="TableDescription" />
                        </FormGroup>
                        <FormGroup >
                            <Form.ControlLabel>Tipo Tabela</Form.ControlLabel>
                            <Form.Control name="TableType" accepter={SelectPicker} data={selecTipoTabela} disabled />
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => { setOpenEdit(false) }}>Cancelar</Button>
                    <Button onClick={handleSubmitEdit} appearance="primary">
                        Salvar
                    </Button>
                </Modal.Footer>
            </Modal>

        </App>
    )
}