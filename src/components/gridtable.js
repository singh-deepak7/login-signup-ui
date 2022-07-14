import React from 'react';
import 'date-fns';
import PropTypes from 'prop-types';
import { makeStyles,useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import IconButton from '@material-ui/core/IconButton';
import FirstPageicon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import FilterListIcon from '@material-ui/icons/FilterList';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';
import { TableBody } from '@mui/material';

const useStyles1 = makeStyles((theme) => ({
    root:{
        flexShrink: 0,
        marginLeft: theme.spacing(1),
    },
    next:{
        padding: 0
    }
}));

function TablePageinationActions(props){
    const classes = useStyles1();
    const theme = useTheme();
    const {count, page, rowsPerPage, onChangePage} = props;

    const handleFirstPageButtonClick = (event) =>{
        onChangePage(event, 0);
    };

    const handleBackButtonClick = (event) =>{
        onChangePage(event, page - 1);
    };

    const handleNextButtonClick = (event) =>{
        onChangePage(event, page + 1);
    };

    const handleLastPageButtonClick = (event) =>{
        onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return(
        <div className={classes.root}>
            <IconButton
             onClick={handleFirstPageButtonClick}
             disabled={page === 0}
             aria-label="first page"
             className={classes.next}
             >
                {theme.direction === 'rt1' ? <LastPageIcon /> : <FirstPageicon />}
             </IconButton>
             <IconButton
              onClick={handleBackButtonClick}
              disabled={page === 0}
              aria-label="previous page"
              className={classes.next}
             >
                {theme.direction === 'rt1' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
             </IconButton>
             <IconButton
               onClick={handleNextButtonClick}
               disabled={page >= Math.ceil(count / rowsPerPage) - 1}
               aria-label="next page"
               className={classes.next}
             >
                {theme.direction === 'rt1' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
             </IconButton>
             <IconButton
               onClick={handleLastPageButtonClick}
               disabled={page >= Math.ceil(count / rowsPerPage) - 1}
               aria-label="last page"
               className={classes.next}
             >
                {theme.direction === 'rt1' ? <FirstPageicon /> : <LastPageIcon />}
             </IconButton>
        </div>

    );
}

TablePageinationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

const useStyles = makeStyles({
    root:{
        "& .MuiPopover-paper":{
            maxWidth:150
        },
        "&::-webkit-scrollbar":{
            display:"block !important"
        }
    },
    table: {
        '& .MuiTableRow-root:nth-of-type(even)':{
            backgroundColor: '#f7f8f9'
        },
        '& .MuiTablePagination-selecRoot':{
            marginLeft: '3px',
            marginRight: '8px'
        },
        "& .MuiTableCell-sizeSmall":{
            padding:6
        },
        "& .MuiTableCell-sizeSmall:last-child":{
            paddingRight:0
        },
        "& .MuiTablePagination-toolbar":{
            minHeight:35
        }
    },
    header:{
        backgroundColor: '#dbdee2'
    },
    tableLabel:{
        width:"67%"
    },
    tableHead:{
        verticalAlign:"top"
    }

});

function createData(props,data,page,rowsPerPage){
    console.log("data sie " + data.length )
    if(data.length < 1){
        return React.cloneElement(<TableRow>
            <TableCell colSpan={props.columns.length} align="center">
                No rows to show
            </TableCell>
        </TableRow>,{key:"norows"})
    }

    return data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) =>
        React.cloneElement(
            <TableRow>{ 
                props.columns.map((column) => {
                    if(column.type === 'date'){
                        
                        return React.cloneElement(<TableCell align="left">{convertDateFromServer(row[column.field])}</TableCell>,{key:column.field})
                    }
                    else if(column.type === 'link'){
                        return React.cloneElement(<TableCell align="left" style={{color:'#33f', cursor:'pointer'}} onClick={()=>column.renderAction(row)}>{row[column.field]}</TableCell>,{key:column.field})
                    }
                    else if(column.type === 'symbol'){
                        return React.cloneElement(<TableCell align="left">{column.renderView()}</TableCell>,{key:column.field})
                    }
                    else if(column.type === 'button'){
                        return React.cloneElement(<TableCell align="left" onClick={()=>column.renderAction(row)}>{column.renderView(row)}</TableCell>,{key:column.field})
                    }
                    else if(column.type === 'input'){
                        return React.cloneElement(<TableCell align="left">{column.renderView(row,column.field,(index + (page*rowsPerPage)))}</TableCell>,{key:column.field})
                    }
                    else{
                        return React.cloneElement(<TableCell align="left">{row[column.field] !== null && row[column.field] !== undefined && row[column.field].length > 50 ? row[column.field].slice(0,40) + '...' : row[column.field]}</TableCell>,{key:column.field})
                    }
                })
            }</TableRow>, {key:index})
    );

}

function convertDateFromServer(value){
    if(value !== null && value !== undefined){
        let serverDateArray = [];
        value.indexOf('-') === -1 ? serverDateArray =  value.split("/") : serverDateArray = value.split("-");
        if(serverDateArray.length > 1){
            return serverDateArray[1]+"/"+serverDateArray[2]+"/"+serverDateArray[0];
        }else{
            return serverDateArray[0];
        }
    } else{
        return null;
    }
}

export default function GridTable(props){
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowData, setRowData] = React.useState(props.data);
    const [sortDir, setSortDir] = React.useState(true);
    const [filterValue, setFilterValue] = React.useState(10);
    const [currentFilter, setCurrentFilter] = React.useState(props.columns[0].field);
    const [rowsPerPage, setRowsPerPage] = React.useState(props.rowsPerPage === undefined ? 5 : props.rowsPerPage);
    let filters = [...props.columns];
    const columnfil = filters.reduce((map,obj) =>{
        map[obj.field] = 10; return map
    }, {});
    const [filter, setFilter] = React.useState(columnfil);
    const filterfil = filters.reduce((map,obj)=>{
        (obj.type === "date" ? map[obj.field] = null : map[obj.field] = ""); return map
    }, {});
    const [filterInput, setFilterInput] = React.useState(filterfil);
    const [filterInputValue, setFilterInputValue] = React.useState("");
    const [anchorE1, setAnchorE1] = React.useState(null);

    React.useEffect(() => {
        setRowData(props.data);
        setCurrentFilter(props.columns[0].field);
    }, [props.rowsPerPage]);

    const handleClick = (event,column) =>{
        setCurrentFilter(column.field);
        setAnchorE1(event.currentTarget);
        setFilterValue(filter[column.field]);
        setFilterInputValue(filterInput[column.field]);
    };

    const handleClose = () => {
        setCurrentFilter(props.columns[0].field);
        setAnchorE1(null);
        setFilterValue(10);
    };

    const handleChangePage = (event, newPage) =>{
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) =>{
        setRowsPerPage(parseInt(event.target.value));
        setPage(0);
    };

    const changeFilter = (event) => {
        filter[currentFilter] = event.target.value;
        setFilter(filter);
        setFilterValue(filter[currentFilter]);
        props.columns.filter(obj=>{return obj.field === currentFilter})[0].type !== "date" ? filterData(filterInput[currentFilter]) : filterDate(filterInput[currentFilter]);

    };

    const doFilter = (event) =>{
        if(event !== "Invalid Date"){
            let value = null;
            props.columns.filter(obj=>{return obj.field === currentFilter})[0].type === "date" ? (value = event) : (value = event.target.value);
            setFilterInputValue(value);
            filterInput[currentFilter] = value;
            setFilterInput(filterInput);
            props.columns.filter(obj => {return obj.field === currentFilter})[0].type !== "date" ? filterData(value) : filterDate(value);
        }
    }

    const filterData = (value) =>{
        switch(filter[currentFilter]){
            case 10:
                (value.length >= 1) ? setRowData(props.data.filter((data) => {
                    return data[currentFilter].toString().toLowerCase() === (value.toString().toLowerCase());
                })) : setRowData(props.data);
                break;
            case 20:
                (value.length >= 1) ? setRowData(props.data.filter((data) => {
                    return data[currentFilter].toString().toLowerCase().includes(value.toString().toLowerCase());
                })) : setRowData(props.data);
                break;
            case 30:
                (value.length >= 1) ? setRowData(props.data.filter((data) => {
                    return data[currentFilter].toString().toLowerCase() !== (value.toString().toLowerCase());
                })) : setRowData(props.data);
                break;
            default:
                setRowData(props.data);
        }
    }

    const filterDate = (value) =>{
        switch(filter[currentFilter]){
            case 10:
                (value !== null) ? setRowData(props.data.filter((data) => {
                    return new Date(convertDateFromServer(data[currentFilter])).getTime() === (new Date(value.setHours(0,0,0,0)).getTime());
                })) : setRowData(props.data);
                break;
            case 20:
                (value !== null) ? setRowData(props.data.filter((data) => {
                    return new Date(convertDateFromServer(data[currentFilter])) < (new Date(value));
                })) : setRowData(props.data);
                break;
            case 30:
                (value !== null) ? setRowData(props.data.filter((data) => {
                    return new Date(convertDateFromServer(data[currentFilter])) < (new Date(value));
                })) : setRowData(props.data);
                break;
            default:
                setRowData(props.data);
        }
    }

    const changeSortDir = (column) => {
        sortDir
          ? props.data.sort((a, b) => (a[column.field] > b[column.field] ? -1 : 1))
          : props.data.sort((a, b) => (a[column.field] < b[column.field] ? -1 : 1))
          setSortDir(!sortDir);
      }

      return (
        <TableContainer component={Paper} className="grid">
            <Table className={classes.table} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow className={classes.header}>
                        {props.columns.map((column) => React.cloneElement( <TableCell className={classes.tableHead}>
                            <TableSortLabel direction={sortDir ? 'asc' : 'desc'} onClick={()=> changeSortDir(column)} className={classes.tableLabel}>{column.name}</TableSortLabel>
                            <Box style={{float: 'right', borderRight: '2px solid #ccc', color: '#ccc'}}>
                                <IconButton aria-controls={"simple-menu"+ column.name} aria-haspopup="true" onClick={(event)=>handleClick(event,column)} style={{padding:0}}>
                                    <FilterListIcon fontSize="small" />
                                </IconButton>
                                <Menu 
                                    id={"simple-menu"+column.name}
                                    anchorEl={anchorE1}
                                    keepMounted
                                    open={Boolean(anchorE1)}
                                    onClose={handleClose}
                                    className={classes.root}
                                    >
                                        <MenuItem value={1}>
                                            <FormControl size="small">
                                                <Select 
                                                    value={filterValue}
                                                    onChange={changeFilter}
                                                    displayEmpty
                                                    inputProps={{'aria-label': 'Filter Options'}}
                                                >
                                                    <MenuItem value={10}>Equals</MenuItem>
                                                    {props.columns.filter(obj=>{return obj.field === currentFilter})[0].type === "date" ? <MenuItem value={20}>Less than</MenuItem> : <MenuItem value={20}>Contains</MenuItem>}
                                                    {props.columns.filter(obj=>{return obj.field === currentFilter})[0].type === "date" ? <MenuItem value={30}>Greater than</MenuItem> : <MenuItem value={20}>Not Equals</MenuItem>}
                                                </Select>
                                            </FormControl>
                                        </MenuItem>

                                        <MenuItem value={0} onKeyDown={e => e.stopPropagation()}>
                                            <FormControl size="small">
                                                {props.columns.filter(obj=> {return obj.field === currentFilter})[0].type !== "date" ? <TextField value={filterInputValue} onChange={doFilter} /> :
                                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                    <KeyboardDatePicker
                                                        variant="inline"
                                                        format="MM/dd/yyyy"
                                                        margin="normal"
                                                        autoOk={true}
                                                        value={filterInputValue}
                                                        onChange={date => doFilter(date)}
                                                        placeholder="MM/dd/yyyy"
                                                        KeyboardButtonProps={{'aria-label': 'change date', }}
                                                        />
                                                </MuiPickersUtilsProvider>}
                                            </FormControl>
                                        </MenuItem>
                                    </Menu>
                            </Box>
                        </TableCell>,{key:column.name}))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {createData(props, rowData, page, rowsPerPage)}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination 
                            rowsPerPageOptions={[5,10,25,50, {label: 'All' , value: rowData.length}]}
                            colSpan={props.columns.length}
                            count={rowData.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            SelectProps={{
                                inputProps: { 'aria-label' : 'rows per page'},
                                native: true,
                            }}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                            ActionsComponent={TablePageinationActions}
                            />
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
      );
}

