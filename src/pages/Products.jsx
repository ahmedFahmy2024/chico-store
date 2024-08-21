import { Container } from '@mui/material';
import ProductsTable from '../components/ProductsTable';

export default function Products() {
  return (
    <div>
      <Container maxWidth="xl">
        <ProductsTable />
      </Container>
    </div>
  )
}
