import { Container } from '@mui/material';
import OrdersTable from '../components/OrdersTable';
export default function Orders() {
  return (
    <div>
      <Container maxWidth="xl">
        <OrdersTable />
      </Container>
    </div>
  )
}
