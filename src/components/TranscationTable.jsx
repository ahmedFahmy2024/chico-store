import { Box, Button, Stack } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import AddIcon from '@mui/icons-material/Add';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { red, green, orange } from '@mui/material/colors';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import axios from 'axios';
import { Axios } from '../api/Axios';
import { baseUrl, TRANSCATION, ORDERS } from '../api/Api';
import Cookie from 'cookie-universal';
import { useMemo, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ToastContext from '../context/ToastProvider';
import { LocalContext } from '../context/LocalContext';
import { useNavigate } from 'react-router-dom';

const formatCreatedAt = (createdAt) => {
    const date = new Date(createdAt);
    const options = { year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric', minute: '2-digit' };
    return date.toLocaleDateString('en-US', options);
};

export default function TranscationTable() {
    const [transcation, setTranscation] = useState([]);
    const [order, setOrder] = useState([]);
    const { locale, setLocale } = useContext(LocalContext);
    const { showHideToast } = useContext(ToastContext);
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    //  ====== get all data ========
    useEffect(() => {
        setLoading(true);
        Axios.get(`${TRANSCATION}`,)
            .then(function (response) {
                const TranscationData = response.data.transactions;
                Axios.get(`${ORDERS}`,)
                    .then(function (response) {
                        const OrderData = response.data.orders;
                        setOrder(OrderData);
                        // Map transactions to include booking numbers and user names
                        const transactionsWithData = TranscationData.map(transaction => {
                            const correspondingOrder = OrderData.find(order => order.id === transaction.order_id);
                            return {
                                ...transaction,
                                order_number: correspondingOrder ? correspondingOrder.order_number : '',
                            };
                        });
                        setTranscation(transactionsWithData);
                        // console.log(transcation);
                        setLoading(false);
                    })
                    .catch(function (error) {
                        console.log(error);
                        setLoading(false);
                    });
            })
            .catch(function (error) {
                console.log(error);
                showHideToast('Something went wrong, please try again', 'error');
                setLoading(false);
            });
    }, []);

    //  ====== get all data ========

    //  ================ add function ================
    function handleAddClick() {
        navigate('/dashboard/transaction/new')
    }
    //  ================ add function ================

    //  ================ edit function ================
    function handleEditClick(id) {
        navigate(`/dashboard/transaction/${id}/edit`)
    }
    //  ================ edit function ================

    //  ====== open && close delete state ========
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [rowToDelete, setRowToDelete] = useState(null);
    //  ====== open && close delete state ========

    //  ================ delete function ================
    function handleDeleteClick(id) {
        setRowToDelete(id);
        setShowDeleteDialog(true);
    }

    function handleDeleteClose() {
        setShowDeleteDialog(false);
    }

    async function handleDeleteConfirm() {
        setLoading(true);
        const cookies = Cookie()
        const token = cookies.get('e-commerce')

        try {
            const response = await axios.delete(`${baseUrl}${TRANSCATION}/${rowToDelete}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            const updatedRow = transcation.filter((row) => row.id !== rowToDelete);
            // console.log(updatedRow);
            setTranscation(updatedRow);
            handleDeleteClose();
            showHideToast(t('Deleted successfully'), 'success');
            setLoading(false);
        } catch (error) {
            console.log(error);
            showHideToast('Something went wrong, please try again', 'error');
            setLoading(false);
        }
    }
    //  ================ delete function ================


    const columns = useMemo(
        () => [
            {
                accessorKey: 'index',
                header: '#',
                size: 80,
                muiTableHeadCellProps: {
                    align: 'center',
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },
                muiTableFooterCellProps: {
                    align: 'center',
                },
            },
            {
                accessorKey: 'order_number',
                header: (t('Order Number')),
                size: 150,
                muiTableHeadCellProps: {
                    align: 'center',
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },
                muiTableFooterCellProps: {
                    align: 'center',
                },
            },
            {
                accessorKey: 'payment_method',
                header: (t('Payment Method')),
                size: 150,
                muiTableHeadCellProps: {
                    align: 'center',
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },
                muiTableFooterCellProps: {
                    align: 'center',
                },
            },
            {
                accessorKey: 'transaction_id',
                header: (t('Transaction Id')),
                size: 150,
                muiTableHeadCellProps: {
                    align: 'center',
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },
                muiTableFooterCellProps: {
                    align: 'center',
                },
            },
            {
                accessorKey: 'created_at',
                header: (t('Created At')),
                size: 150,
                muiTableHeadCellProps: {
                    align: 'center',
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },
                muiTableFooterCellProps: {
                    align: 'center',
                },
                Cell: ({ cell }) => formatCreatedAt(cell.getValue()),
            },
            {
                accessorKey: 'amount',
                header: (t('Amount')),
                size: 150,
                muiTableHeadCellProps: {
                    align: 'center',
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },
                muiTableFooterCellProps: {
                    align: 'center',
                },
            },
            {
                accessorKey: 'status',
                header: (t('Status')),
                size: 100,
                muiTableHeadCellProps: {
                    align: 'center',
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },
                muiTableFooterCellProps: {
                    align: 'center',
                },
                Cell: ({ cell }) => (
                    <Box
                        component="div"
                        sx={{
                            backgroundColor:
                                cell.getValue() === 'success'
                                    ? green[100]
                                    : cell.getValue() === 'pending'
                                        ? orange[100]
                                        : red[100],
                            border: `1px solid ${cell.getValue() === 'success'
                                ? green[300]
                                : cell.getValue() === 'pending'
                                    ? orange[300]
                                    : red[300]}`,
                            borderRadius: '4px',
                            color:
                                cell.getValue() === 'success'
                                    ? green[700]
                                    : cell.getValue() === 'pending'
                                        ? orange[700]
                                        : red[700],
                        }}
                    >
                        {cell.getValue()}
                    </Box>
                ),
            },
            {
                accessorKey: 'Action',
                header: (t('Actions')),
                size: 150,
                muiTableHeadCellProps: {
                    align: 'center',
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },
                muiTableFooterCellProps: {
                    align: 'center',
                },
                Cell: ({ cell }) => (
                    <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'center' }}>
                        <IconButton onClick={() => handleEditClick(cell.row.original.id)}>
                            <ModeEditIcon color="primary" fontSize="small" />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteClick(cell.row.original.id)}>
                            <DeleteIcon color="error" fontSize="small" />
                        </IconButton>
                    </Stack>
                ),
            },
        ],
        [t, setTranscation, transcation, handleEditClick, handleDeleteClick],
    );

    const renderedRows = useMemo(() => {
        return transcation.map((row, index) => {
            return { ...row, index: index + 1 };
        });
    }, [transcation]);

    const table = useMaterialReactTable({
        columns,
        data: renderedRows,
        initialState: { density: 'compact', pagination: { pageSize: 25 } },
    });

    // ================= loading =================
    if (loading) {
        return (
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        )
    }

    return (
        <div dir={locale === "en" ? "ltr" : "rtl"} className={locale === "en" ? "ltr" : "rtl"} style={{ marginTop: '20px' }}>
            <Stack direction='row' sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ fontSize: '20px', fontWeight: 'bold', mb: '20px' }}>
                    {t('Transcations')}
                </Typography>
                <Stack onClick={handleAddClick} direction='row' className='addBtn' >
                    <div className='addBtn-link' >
                        <span style={{ display: 'inherit' }}>
                            <AddIcon sx={{ fontSize: "20px" }} />
                        </span>
                        {t("New Transcation")}
                    </div>
                </Stack>
            </Stack>

            <MaterialReactTable table={table} />
            <Dialog
                dir={locale === "en" ? "ltr" : "rtl"}
                // className={locale === "en" ? "ltr" : "rtl"}
                open={showDeleteDialog}
                onClose={handleDeleteClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {t('Are you sure you want to delete this item?')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText className='dialogDelete' sx={{ padding: "0 0 10px !important", }} id="alert-dialog-description">
                        {t('This item will be permanently deleted.')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleDeleteClose} sx={{ textTransform: 'capitalize' }}>{t('Disagree')}</Button>
                    <Button className='dialogDeleteBtn' variant="contained" color="error" onClick={handleDeleteConfirm} sx={{ textTransform: 'capitalize' }} autoFocus>
                        {t('Agree')}
                    </Button>
                </DialogActions>
            </Dialog>
            {/* ================ delete dialog ================ */}

        </div>
    )
}
