import './campos.css';
import App from '../../../application/App';
import { Table, Pagination, Loader, FlexboxGrid, Navbar, Nav, Stack, Button, SelectPicker, Message, toaster, IconButton, Modal, Form } from 'rsuite';
import { useEffect, useState } from 'react';
import camposService from '../../../services/administracao/campos.service';
import { FaPlus } from 'react-icons/fa';
import tabelasService from '../../../services/administracao/tabelas.service';
import { FiDelete, FiEdit } from 'react-icons/fi';

const { Column, HeaderCell, Cell } = Table;

const CompactCell = props => <Cell {...props} style={{ padding: 4 }} />;
const CompactHeaderCell = props => <HeaderCell {...props} style={{ padding: 4 }} />;

export default function Campos() {
    const [noData, setNoData] = useState(false);
    const [campos, setCampos] = useState([]);
    const [tabelas, setTabelas] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [tableName, setTableName] = useState('');


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

    useEffect(() => {
        setLoading(true);
        tabelasService.getNomeTabelaDescricao().then((response) => {
            if (response.status === 200) {
                setTabelas(response.data.map((item) => ({ label: item.TableName, value: `@${item.TableName}` })));
            } else {
                toaster.push(msgError(response.data, 'carregar'));
                setTabelas([]);
            }

        });
        setLoading(false);


    }, []);

    const carregaCampos = (tabela) => {
        setLoading(true);
        setTableName(tabela);
        //console.log(tabela);
        camposService.getCamposByTable(tabela).then((response) => {
            if (response.status === 200) {
                setCampos(response.data);
            } else {
                toaster.push(msgError(response.data, 'carregar'));
                setCampos([]);
                setNoData(true);
            }

        });
        setLoading(false);
    }

    const selecionaPagina = (p) => {
        //console.log(p);
        setPage(p);
        camposService.nextPageCampos((p - 1) * 20, tableName).then((response) => {
            setCampos(response.data);
            setTotalRecords(parseInt(response.count));
            //console.log(response);
        })
    };


    const ActionCell = ({ rowData, dataKey, ...props }) => {

        return (
            <Table.Cell {...props} align='center' >
                <IconButton size="md" color='yellow' appearance="subtle" icon={<FiEdit />} onClick={() => atualizaCampo(rowData)} />
                <IconButton size="md" color='red' appearance="subtle" icon={<FiDelete />} onClick={() => deletaCampo(rowData[dataKey])} />
            </Table.Cell>
        );
    };

    const atualizaCampo = (campo) => {
        console.log(campo);
    }

    const deletaCampo = (id) => {
        console.log(id);
    }
    


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
                                    <Button color="blue" appearance="primary" onClick={() => open ? setOpen(false) : setOpen(true)}
                                        disabled={tableName === '' ? true : false} >
                                        <FaPlus /> Criar Campo
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

                                <SelectPicker data={tabelas} block locale={{ placeholder: 'selecionar Tabela', searchPlaceholder: 'Procurar tabela' }}
                                    onSelect={carregaCampos} cleanable={false} />
                                <Table
                                    autoHeight
                                    locale={{ emptyMessage: 'Nenhum registro encontrado' }}
                                    loading={loading}
                                    data={noData ? [] : campos}
                                    headerHeight={ 40 }
                                    rowHeight={ 40 }
                                    
                                >
                                    <Column flexGrow={2} fixed verticalAlign='middle'>
                                        <CompactHeaderCell>Nome</CompactHeaderCell>
                                        <CompactCell dataKey="Name" />
                                    </Column>

                                    <Column flexGrow={2} fixed verticalAlign='middle'>
                                        <CompactHeaderCell>Descrição</CompactHeaderCell>
                                        <CompactCell dataKey="Description" />
                                    </Column>

                                    <Column flexGrow={2} fixed verticalAlign='middle'>
                                        <CompactHeaderCell>Tipo</CompactHeaderCell>
                                        <CompactCell dataKey="Type" />
                                    </Column>

                                    <Column flexGrow={2} fixed verticalAlign='middle'>
                                        <CompactHeaderCell>Sub-Tipo</CompactHeaderCell>
                                        <CompactCell dataKey="SubType" />
                                    </Column>

                                    <Column flexGrow={2} fixed verticalAlign='middle'>
                                        <CompactHeaderCell>Obrigatório</CompactHeaderCell>
                                        <CompactCell dataKey="Mandatory" />
                                    </Column>

                                    <Column flexGrow={2} fixed verticalAlign='middle'>
                                        <CompactHeaderCell>Tamanho</CompactHeaderCell>
                                        <CompactCell dataKey="EditSize" />
                                    </Column>

                                    <Column flexGrow={2} align='center' verticalAlign='middle'>
                                        <Table.HeaderCell></Table.HeaderCell>
                                        <ActionCell dataKey="TableName" />
                                    </Column>

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
                                        locale={{ total: 'Total de Tabelas: {0}' }}
                                    />
                                </div>


                            </>
                    }


                </FlexboxGrid.Item>

            </FlexboxGrid>

            <Modal backdrop="static" open={open} onClose={() => { setOpen(false) }} size="xs">
                <Modal.Header>
                    <Modal.Title>Criar Campo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form fluid>
                        <Form.Group>
                            <Form.ControlLabel>Nome</Form.ControlLabel>
                            <Form.FormControl name="name" />
                        </Form.Group>
                        <Form.Group>
                            <Form.ControlLabel>Descrição</Form.ControlLabel>
                            <Form.FormControl name="description" />
                        </Form.Group>
                        <Form.Group>
                            <Form.ControlLabel>Tipo</Form.ControlLabel>
                            <Form.FormControl name="type" />
                        </Form.Group>
                        <Form.Group>
                            <Form.ControlLabel>Sub-Tipo</Form.ControlLabel>
                            <Form.FormControl name="subtype" />
                        </Form.Group>
                        <Form.Group>
                            <Form.ControlLabel>Obrigatório</Form.ControlLabel>
                            <Form.FormControl name="mandatory" />
                        </Form.Group>
                        <Form.Group>
                            <Form.ControlLabel>Tamanho</Form.ControlLabel>
                            <Form.FormControl name="size" />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setOpen(false)} appearance="primary">
                        Criar
                    </Button>
                    <Button onClick={() => setOpen(false)} appearance="subtle">
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>





        </App>
    );
}