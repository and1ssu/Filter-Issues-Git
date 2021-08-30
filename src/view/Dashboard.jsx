import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import api from '../Api';
import { useEffect } from 'react';
import StarsIcon from '@material-ui/icons/Stars';
import { Badge, Button, ButtonGroup, Container, FormControl, Grid, TableHead, Tooltip } from '@material-ui/core';
import Zoom from '@material-ui/core/Zoom';
import SearchIcon from '@material-ui/icons/Search';
import ChatIcon from '@material-ui/icons/Chat';
import moment from "moment";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";


const useStyles1 = makeStyles((theme) => ({
    root: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
    },

}));

function TablePaginationActions(props) {
    const classes = useStyles1();
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };


    return (
        <div className={classes.root}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </div>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};


const useStyles2 = makeStyles((theme) => ({
    table: {
        minWidth: 500,
    },
    formControl: {
        margin: theme.spacing(5),
        minWidth: 150
    },
    ButtonGroup: {
        padding: 10
    }

}));

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
    wrow: {
        width: '555px',
    }
}))(TableRow);

export default function CustomPaginationActionsTable() {
    const classes = useStyles2();
    const [page, setPage] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [rows, setRows] = useState([]);
    const [statusBlock, setStatusBlock] = useState('full');
    const [arrayVirtual, setArrayVirtual] = useState([]);

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const onInit = async () => {
        const response = await api.getIssues();
        if (response) {
            setRows(response)
            setArrayVirtual(response)
        } else {
            setRows([])
        }
    }
    useEffect(() => {
        onInit().then();
    }, []);

    const getDataFilter = () => {
        let list = arrayVirtual        
        if (statusBlock !== 'full') {
            list = list.filter(option => {
                return option.state === statusBlock
            })
        }
        setRows(list)
    }

    const getDateDesc = () => {
        let list = arrayVirtual.sort(function (a, b) {
            return new Date(a.created_at) - new Date(b.created_at);
        })       
        setRows(list)
    }

    const getDateDescUp = () => {
        let list = arrayVirtual.sort(function (a, b) {
            return new Date(b.created_at) - new Date(a.created_at);
        })        
        setRows(list)
    }

    const getComments = () => {
        let list = rows.sort(function (a, b) {
            return parseInt(b.comments) - parseInt(a.comments);
        })        
        setRows(list)
    }

    return (
        <Container component={Paper}>
            <Grid>
                <Grid item lg={6}>
                    <FormControl variant="outlined" className={classes.formControl}>
                        <Grid>
                            <Grid item>
                                <InputLabel id="demo-simple-select-outlined-label">Busca issues</InputLabel>
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    value={statusBlock}
                                    onChange={(event) => setStatusBlock(event.target.value)}
                                    label="busca issues"                                >
                                    <MenuItem value={'full'}>Todos</MenuItem>
                                    <MenuItem value={'closed'}>Fechados</MenuItem>
                                    <MenuItem value={'open'}>Abertos</MenuItem>
                                </Select>
                                <Button data-testid="selectBtn" type={'button'} onClick={() => getDataFilter()} className={'btn btn-info'}><SearchIcon
                                /></Button>
                            </Grid>
                        </Grid>
                    </FormControl>
                </Grid>
                <Grid item lg={6} className={classes.ButtonGroup}>
                    <ButtonGroup color="secondary" aria-label="outlined secondary button group">
                        <Button data-testid="selectBtn" type={'button'} onClick={() => getDateDesc()} className={'btn btn-info'}>Mais velho</Button>
                        <Button data-testid="selectBtn" type={'button'} onClick={() => getDateDescUp()} className={'btn btn-info'}>Mais novo</Button>
                        <Button data-testid="selectBtn" type={'button'} onClick={() => getComments()} className={'btn btn-info'}>Mais Comentarios</Button>

                    </ButtonGroup>
                </Grid>
            </Grid>
            <Table className={classes.table}>
               
                <TableBody>
                    {(rowsPerPage > 0
                        ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : rows
                    ).map((data) => (
                        <StyledTableRow key={data}>
                            <TableCell component="th" scope="row">
                                <Tooltip TransitionComponent={Zoom} title={data.state}>
                                    <StarsIcon style={{ color: data.state === 'open' ? 'green' : 'red' }} />
                                </Tooltip>
                                <h3>{data.title}</h3>
                                <Badge badgeContent={data.comments} color="primary">
                                    <ChatIcon />
                                </Badge>
                                <span style={{ padding: 12, fontWeight: "800" }}> #{data.number}</span>
                                <span style={{ fontWeight: "600" }}>Data:  {moment(data.created_at).format("DD/MM/YYYY HH:mm:ss").toString()}</span>
                            </TableCell>
                        </StyledTableRow>
                    ))}

                    {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                            <TableCell colSpan={6} />
                        </TableRow>
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, { label: 'All', value: -1 }]}
                            labelRowsPerPage={'Linhas por página:'}
                            colSpan={1}
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            SelectProps={{
                                inputProps: { 'aria-label':'rows per page' },
                                native: true,
                            }}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        </Container>
    );
}
