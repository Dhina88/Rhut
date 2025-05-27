import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  Rating,
  Tabs,
  Tab,
} from '@mui/material';
import axios from 'axios';

const BrokerList = () => {
  const [brokers, setBrokers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchBrokers = async () => {
      try {
        const response = await axios.get('/api/brokers');
        setBrokers(response.data);
      } catch (error) {
        console.error('Error fetching brokers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrokers();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredBrokers = brokers.filter((broker) =>
    tabValue === 0 ? !broker.isPropFirm : broker.isPropFirm
  );

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Recommended Brokers & Prop Firms
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Brokers" />
          <Tab label="Prop Firms" />
        </Tabs>
      </Box>

      <Grid container spacing={3}>
        {filteredBrokers.map((broker) => (
          <Grid item xs={12} md={6} lg={4} key={broker._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="140"
                image={broker.logo}
                alt={broker.name}
                sx={{ objectFit: 'contain', bgcolor: 'background.paper', p: 2 }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2">
                  {broker.name}
                </Typography>
                <Rating value={broker.rating} readOnly precision={0.5} sx={{ mb: 1 }} />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                  component="div"
                >
                  {broker.description}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Minimum Deposit: ${broker.minimumDeposit}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {broker.tradingPlatforms.map((platform) => (
                      <Chip
                        key={platform}
                        label={platform}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
                <Box sx={{ mt: 'auto' }}>
                  <Button
                    variant="contained"
                    fullWidth
                    href={broker.referralLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open Account
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default BrokerList; 