import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { useZustandStore } from "../lib/store";

type IProps = {
  opened: boolean;
  toggleDrawer: () => void;
};

export default function AppDrawer({ opened, toggleDrawer }: IProps) {
  const { setUser, setAddeditems, setBooks } = useZustandStore();
  const DrawerList = (
    <Box
      height="100%"
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer}
    >
      <List>
        {["home", "books"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton component={Link} to={text}>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const UserInfo = (
    <>
      <Divider />
      <Box p={1} sx={{ width: 250 }} role="tabpanel" onClick={toggleDrawer}>
        <Button
          onClick={() => {
            localStorage.removeItem("user");
            setUser(undefined);
            setAddeditems([]);
            setBooks(undefined);
          }}
          fullWidth
          color="error"
        >
          log out
        </Button>
      </Box>
    </>
  );

  return (
    <div>
      <Drawer open={opened} onClose={toggleDrawer}>
        {DrawerList}
        {UserInfo}
      </Drawer>
    </div>
  );
}
