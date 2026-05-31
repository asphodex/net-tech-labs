import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import GitHubIcon from '@mui/icons-material/GitHub';

const StyledFooter = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: theme.spacing(2),
    padding: '16px 20px',
    borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
    border: '1px solid',
    borderColor: theme.palette.divider,
}));

const navLinks = [
    { id: '1', label: 'Главная', href: '#' },
    { id: '2', label: 'Список зданий', href: '#' },
    { id: '3', label: 'Контакты', href: '#' },
];

function Footer() {
    return (
        <Container maxWidth="xl" sx={{ mt: 6, mb: '28px' }}>
            <StyledFooter>
                <Typography variant="subtitle1" sx={{ color: '#5d8aa8' }}>
                    Самые высокие здания и сооружения
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.id}
                            href={link.href}
                            underline="hover"
                            color="text.secondary"
                            variant="body2"
                        >
                            {link.label}
                        </Link>
                    ))}
                </Box>
            </StyledFooter>
            <Divider sx={{ mt: 2 }} />
            <Typography
                variant="caption"
                sx={{
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.secondary',
                    mt: 1.5,
                }}
            >
                {new Date().getFullYear()} Самые высокие здания и сооружения.
            </Typography>
        </Container>
    );
}

export default Footer;
