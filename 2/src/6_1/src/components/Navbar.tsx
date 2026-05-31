import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import {styled} from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import MenuItem from '@mui/material/MenuItem';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

const StyledToolbar = styled(Toolbar)(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
    borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
    border: '1px solid',
    borderColor: theme.palette.divider,
    padding: '8px 12px',
}));

// Стилизованный MenuItem для выпадающего меню:
// - выделение активного пункта (variant="contained" => фон info)
// - смена цвета при наведении
const StyledMenuItem = styled(MenuItem, {
    shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive?: boolean }>(({theme, isActive}) => ({
    backgroundColor: isActive ? theme.palette.info.main : 'transparent',
    color: isActive ? theme.palette.info.contrastText : 'inherit',
    '&:hover': {
        backgroundColor: isActive
            ? theme.palette.info.dark
            : theme.palette.action.hover,
        color: isActive
            ? theme.palette.info.contrastText
            : theme.palette.primary.main,
    },
}));

interface ComponentProps {
    active: string;
}

// Пункты меню описываем массивом, чтобы можно было пройтись .map'ом
// (функциональный стиль вместо повторного копипаста кнопок/пунктов).
const menuItems = [
    {id: '1', label: 'Главная'},
    {id: '2', label: 'Список зданий'},
    {id: '3', label: 'Контакты'},
];

function Navbar({active}: ComponentProps) {
    const [open, setOpen] = React.useState(false);

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    return (
        <AppBar
            position="static"
            sx={{
                boxShadow: 0,
                bgcolor: 'transparent',
                mt: '28px',
            }}
        >
            <Container maxWidth="xl">
                <StyledToolbar>
                    <Typography variant="h6" sx={{color: '#5d8aa8'}}>
                        Самые высокие здания и сооружения
                    </Typography>

                    <Box sx={{display: {xs: 'none', md: 'flex'}}}>
                        {menuItems.map((item) => (
                            <Button
                                key={item.id}
                                variant={active === item.id ? 'contained' : 'text'}
                                color="info"
                                size="medium"
                            >
                                {item.label}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{display: {xs: 'flex', md: 'none'}}}>
                        <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
                            <MenuIcon/>
                        </IconButton>

                        <Drawer
                            anchor="top"
                            open={open}
                            onClose={toggleDrawer(false)}
                        >
                            <Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                    }}
                                >
                                    <IconButton onClick={toggleDrawer(false)}>
                                        <CloseRoundedIcon/>
                                    </IconButton>
                                </Box>
                                {menuItems.map((item) => (
                                    <StyledMenuItem
                                        key={item.id}
                                        isActive={active === item.id}
                                    >
                                        {item.label}
                                    </StyledMenuItem>
                                ))}
                            </Box>
                        </Drawer>
                    </Box>
                </StyledToolbar>
            </Container>
        </AppBar>
    );
}

export default Navbar;
