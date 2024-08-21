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
import { baseUrl, USERS } from '../api/Api';
import Cookie from 'cookie-universal';
import { useMemo, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ToastContext from '../context/ToastProvider';
import { LocalContext } from '../context/LocalContext';
import { useNavigate } from 'react-router-dom';


export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const { locale, setLocale } = useContext(LocalContext);
  const { showHideToast } = useContext(ToastContext);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  //  ====== get all data ========
  useEffect(() => {
    setLoading(true);
    Axios.get(`${USERS}`,)
      .then(function (response) {
        // console.log(response.data.users);
        setUsers(response.data.users);
        setLoading(false);
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
    navigate('/dashboard/users/new')
  }
  //  ================ add function ================

  //  ================ edit function ================
  function handleEditClick(id) {
    navigate(`/dashboard/users/${id}/edit`);
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
      const response = await axios.delete(`${baseUrl}${USERS}/${rowToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const updatedRow = users.filter((row) => row.id !== rowToDelete);
      // console.log(updatedRow);
      setUsers(updatedRow);
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
        accessorKey: 'name',
        header: (t('Name')),
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
        accessorKey: 'email',
        header: (t('Email')),
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
        accessorKey: 'is_admin',
        header: (t('Admin')),
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
        Cell: ({ cell }) => (
          <Typography align="center" sx={{ backgroundColor: cell.getValue() ? green[100] : red[100], color: cell.getValue() ? green[700] : red[700], border: `1px solid ${cell.getValue() ? green[300] : red[300]}`, borderRadius: '4px' }}>
            {cell.getValue() ? t('Yes') : t('No')}
          </Typography>
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
    [t, setUsers, users, handleEditClick, handleDeleteClick],
  );

  const renderedRows = useMemo(() => {
    return users.map((row, index) => {
      return { ...row, index: index + 1 };
    });
  }, [users]);

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
          {t('Users')}
        </Typography>
        <Stack onClick={handleAddClick} direction='row' className='addBtn' >
          <div className='addBtn-link' >
            <span style={{ display: 'inherit' }}>
              <AddIcon sx={{ fontSize: "20px" }} />
            </span>
            {t("New User")}
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
