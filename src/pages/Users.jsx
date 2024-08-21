import { Container } from '@mui/material';
import UsersTable from '../components/UsersTable';

export default function Users() {
  return (
    <div>
      <Container maxWidth="xl">
        <UsersTable />
      </Container>
    </div>
  )
}
