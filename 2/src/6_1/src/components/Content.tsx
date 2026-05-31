import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import structures from "../data";
import BuildCard from "./BuildCard";

const cardData = [structures[3], structures[6], structures[9], structures[7]];

function Content() {
    return (
        <Container maxWidth="xl" sx={{ mt: 4 }}>
            <Grid container spacing={{ xs: 3, sm: 6, md: 12 }}>
                {cardData.map((item, index) => (
                    <Grid key={index} size={{ xs: 12, sm: 6,  md: 3 }}>
                        <BuildCard building={item} index={index} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default Content;
