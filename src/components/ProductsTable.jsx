import React, { useState, useContext, useEffect, useMemo } from 'react'
import ToastContext from '../context/ToastProvider';
import { LocalContext } from '../context/LocalContext';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseUrl, PRODUCTS, CATEGORIES } from '../api/Api'
import Cookie from 'cookie-universal';

import { Typography, Stack, Box, Button } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import Dialog from '@mui/material/Dialog';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { red, green, orange } from '@mui/material/colors';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import '../css/producttable.css'

export default function ProductsTable() {
  const [product, setProduct] = useState([]);
  const [category, setCategory] = useState([]);
  const { locale, setLocale } = useContext(LocalContext);
  const { showHideToast } = useContext(ToastContext);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  //  ====== get all data ========
  useEffect(() => {
    setLoading(true);
    axios.get(`${baseUrl}${PRODUCTS}`,)
      .then(function (response) {
        // console.log('products ', response.data.products);
        setProduct(response.data.products);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        showHideToast('Something went wrong, please try again', 'error');
        setLoading(false);
      }
      );
  }, []);

  useEffect(() => {
    setLoading(true);
    axios.get(`${baseUrl}${CATEGORIES}`,)
      .then(function (response) {
        // console.log('categories', response.data.categories);
        setCategory(response.data.categories);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        showHideToast('Something went wrong, please try again', 'error');
        setLoading(false);
      }
      );
  }, []);
  //  ====== get all data ========

  //  ================ add function ================
  function handleAddClick() {
    navigate('/dashboard/products/new')
  }
  //  ================ add function ================

  //  ================ edit function ================
  function handleEditClick(id) {
    navigate(`/dashboard/products/${id}/edit`);
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
      const response = await axios.delete(`${baseUrl}${PRODUCTS}/${rowToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const updatedRow = product.filter((row) => row.id !== rowToDelete);
      // console.log(updatedRow);
      setProduct(updatedRow);
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
        accessorKey: 'images',
        header: (t('Image')),
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
        Cell: ({ cell }) => {
          const images = cell.getValue().split(',');
          return (
            <img src={images[0]} alt="Product" style={{ maxWidth: '50%', maxHeight: '50px', borderRadius: '12px', width: '48px', height: '48px' }} />
          );
        },
      },
      {
        accessorKey: 'Name_en',
        header: (t('Name EN')),
        size: 100,
        muiTableHeadCellProps: {
          align: 'center',
        },
        muiTableBodyCellProps: {
          align: 'center',
          style: { whiteSpace: 'wrap' },
        },
        muiTableFooterCellProps: {
          align: 'center',
        },
      },
      {
        accessorKey: 'Name_ar',
        header: (t('Name AR')),
        size: 100,
        muiTableHeadCellProps: {
          align: 'center',
        },
        muiTableBodyCellProps: {
          align: 'center',
          style: { whiteSpace: 'wrap' },
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
                cell.getValue() === 'published'
                  ? green[100]
                  : cell.getValue() === 'draft'
                    ? orange[100]
                    : red[100],
              border: `1px solid ${cell.getValue() === 'published'
                ? green[300]
                : cell.getValue() === 'draft'
                  ? orange[300]
                  : red[300]}`,
              borderRadius: '4px',
              color:
                cell.getValue() === 'published'
                  ? green[700]
                  : cell.getValue() === 'draft'
                    ? orange[700]
                    : red[700],
            }}
          >
            {cell.getValue()}
          </Box>
        ),
      },
      // {
      //   accessorKey: 'category_id',
      //   header: (t('Category')),
      //   size: 100,
      //   muiTableHeadCellProps: {
      //     align: 'center',
      //   },
      //   muiTableBodyCellProps: {
      //     align: 'center',
      //   },
      //   muiTableFooterCellProps: {
      //     align: 'center',
      //   },
      //   Cell: ({ cell }) => {
      //     const categoryId = cell.row.original.category_id;
      //     const categoryApi = category.find(cat => cat.id === categoryId);
      //     return categoryApi ? (locale === 'en' ? categoryApi.Name_en : categoryApi.Name_ar) : '';
      //   }
      // },
      {
        accessorKey: 'price',
        header: (t('Price')),
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
        accessorKey: 'sale_price',
        header: (t('SalePrice')),
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
      // {
      //   accessorKey: 'stock',
      //   header: (t('Quantity')),
      //   size: 100,
      //   muiTableHeadCellProps: {
      //     align: 'center',
      //   },
      //   muiTableBodyCellProps: {
      //     align: 'center',
      //   },
      //   muiTableFooterCellProps: {
      //     align: 'center',
      //   },
      // },
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
            {/* <IconButton onClick={() => handleViewClick(cell.row.original)}>
              <VisibilityOutlinedIcon color="grey" fontSize="small" />
            </IconButton> */}
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
    [t, handleDeleteClick, handleEditClick, product, setProduct],
  );

  const renderedRows = useMemo(() => {
    return product.map((row, index) => {
      return { ...row, index: index + 1 };
    });
  }, [product]);

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
          {t('Products')}
        </Typography>
        <Stack onClick={handleAddClick} direction='row' className='addBtn' >
          <div className='addBtn-link' >
            <span style={{ display: 'inherit' }}>
              <AddIcon sx={{ fontSize: "20px" }} />
            </span>
            {t("New Product")}
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