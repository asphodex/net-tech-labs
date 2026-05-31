import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

// Компонент для вывода абзацев описания:
// - цвет text.secondary
// - выравнивание по ширине
// - отступы между абзацами
const StyledTypography = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    textAlign: 'justify',
    marginBottom: theme.spacing(1.5),
    '&:last-of-type': {
        marginBottom: 0,
    },
}));

interface ComponentProps {
    building: {
        img: string;
        title: string;
        description: string[];
    };
    index: number;
}

function BuildCard({ building, index }: ComponentProps) {
    // Чётные карточки (0, 2, ...) — картинка справа, контент слева, кнопка слева.
    // Нечётные (1, 3, ...) — картинка слева, контент справа, кнопка справа.
    const isEven = index % 2 === 0;

    return (
        <Card
            sx={{
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <CardMedia
                component="img"
                alt={building.title}
                image={building.img}
            />
            <Box>
                <CardContent>
                    <Typography gutterBottom variant="h5">
                        {building.title}
                    </Typography>
                    {building.description.map((item, ind) => (
                        <StyledTypography key={ind} variant="body2">
                            {item}
                        </StyledTypography>
                    ))}
                </CardContent>
                <CardActions
                    sx={{
                        justifyContent: isEven ? 'start' : 'end',
                        mt: 'auto',
                    }}
                >
                    <Button size="small">Подробнее</Button>
                </CardActions>
            </Box>
        </Card>
    );
}

export default BuildCard;
