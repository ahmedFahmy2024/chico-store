import { Typography, Stack, Box, Button } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import Dialog from '@mui/material/Dialog';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { red, green, orange, blue } from '@mui/material/colors';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import '../css/orderstable.css'
import { Axios } from '../api/Axios';
import axios from 'axios';
import { baseUrl, ORDERS } from '../api/Api';
import React, { useState, useContext, useEffect, useMemo } from 'react'
import ToastContext from '../context/ToastProvider';
import { LocalContext } from '../context/LocalContext';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Cookie from 'cookie-universal';

export default function OrdersTable() {
  const [order, setOrder] = useState([]);
  const { locale, setLocale } = useContext(LocalContext);
  const { showHideToast } = useContext(ToastContext);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  //  ====== get all data ========
  useEffect(() => {
    setLoading(true);
    Axios.get(`${ORDERS}`,)
      .then(function (response) {
        // console.log(response.data.orders);
        setOrder(response.data.orders);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        showHideToast('Something went wrong, please try again', 'error');
        setLoading(false);
      });
  }, []);
  //  ====== get all data ========

  //  ====== open && close delete state ========
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  //  ====== open && close delete state ========

  //  ================ add function ================
  function handleAddClick() {
    navigate('/dashboard/orders/new')
  }
  //  ================ add function ================

  //  ================ edit function ================
  function handleEditClick(id) {
    navigate(`/dashboard/orders/${id}/edit`);
  }
  //  ================ edit function ================

  //  ================ view function ================
  function handleViewClick(id) {
    navigate(`/dashboard/orders/${id}/details`)
  }
  //  ================ view function ================

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
      const response = await axios.delete(`${baseUrl}${ORDERS}/${rowToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const updatedRow = order.filter((row) => row.id !== rowToDelete);
      // console.log(updatedRow);
      setOrder(updatedRow);
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
      },
      {
        accessorKey: 'expand',
        header: (t('Products')),
        size: 50,
        muiTableHeadCellProps: {
          align: 'center',
        },
        muiTableBodyCellProps: {
          align: 'center',
        },
        muiTableFooterCellProps: {
          align: 'center',
        },
        Cell: ({ row }) => (
          <IconButton onClick={() => row.toggleExpanded()}>
            {row.getIsExpanded() ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        ),
      },
      {
        accessorKey: 'total_order_price',
        header: (t('Order Total')),
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
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {Math.ceil(cell.getValue())}
          </Box>
        ),
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
                cell.getValue() === 'complete'
                  ? green[100]
                  : cell.getValue() === 'pending'
                    ? orange[100]
                    : cell.getValue() === 'failed'
                      ? red[100]
                      : blue[100],
              border: `1px solid ${cell.getValue() === 'complete'
                ? green[300]
                : cell.getValue() === 'pending'
                  ? orange[300]
                  : cell.getValue() === 'failed'
                    ? red[300]
                    : blue[300]}`,
              borderRadius: '4px',
              color:
                cell.getValue() === 'complete'
                  ? green[700]
                  : cell.getValue() === 'pending'
                    ? orange[700]
                    : cell.getValue() === 'failed'
                      ? red[700]
                      : blue[700],
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
            <IconButton onClick={() => handleViewClick(cell.row.original.id)}>
              <VisibilityOutlinedIcon color="grey" fontSize="small" />
            </IconButton>
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
    [t, handleDeleteClick, handleEditClick, order, setOrder],
  );

  const renderedRows = useMemo(() => {
    return order.map((row, index) => {
      return { ...row, index: index + 1 };
    });
  }, [order]);

  const table = useMaterialReactTable({
    columns,
    data: renderedRows,
    initialState: { density: 'compact', pagination: { pageSize: 25 } },
    renderDetailPanel: ({ row }) =>
      row.original.products ? (
        <div className='table-expand'>
          {row.original.products.map((product, index) => {
            // Calculate the prices
            const basePrice = product?.sale_price ? product.sale_price : product?.price;
            let amount = product?.pivot?.quantity
            const originalPrice = basePrice * amount;
            let finalPrice = originalPrice;

            if (amount === 2) {
              finalPrice = originalPrice * 0.9; // 10% discount
            } else if (amount >= 3) {
              finalPrice = originalPrice * 0.85; // 15% discount
            }
            return (
              <div className='table-row' key={index}>
                <div className='table-row-image'>
                  <img src={product.images.split(',')[0]} alt="" />
                </div>
                <div className='table-row-name'>{locale === 'en' ? product.Name_en : product.Name_ar}</div>
                <div>x{product.pivot.quantity}</div>
                <div className='table-row-unit-price'>{product.sale_price ? product.sale_price : product.price} {locale === "en" ? "EGP" : "ج.م"} </div>
                <div className='table-row-total-price'>{Math.ceil(finalPrice)} {locale === "en" ? "EGP" : "ج.م"} </div>
              </div>
            )
          })}
        </div>
      ) : null,
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
          {t('Orders')}
        </Typography>
        <Stack onClick={handleAddClick} direction='row' className='addBtn' >
          <div className='addBtn-link' >
            <span style={{ display: 'inherit' }}>
              <AddIcon sx={{ fontSize: "20px" }} />
            </span>
            {t("New Order")}
          </div>
        </Stack>
      </Stack>

      <MaterialReactTable table={table} />

      {/* ================ delete dialog ================ */}
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
