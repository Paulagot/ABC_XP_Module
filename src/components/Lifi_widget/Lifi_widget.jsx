import React, { useMemo } from 'react';
import { LiFiWidget } from '@lifi/widget';

const WidgetPage = () => {
  const widgetConfig = useMemo(() => ({
    variant: "wide",
    subvariant: "split",
    appearance: "light",
    fee: 0.0025,
    theme: {
      palette: {
        primary: { main: "#003f91" },
        secondary: { main: "#28caf6" },
        text: { primary: "#003f91" },
        common: { black: "#003f91" }
      },
      typography: {
        fontFamily: "Poppins, sans-serif",
      },
      container: {
        boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.08)",
        borderRadius: "16px"
      },
      shape: {
        borderRadius: 12,
        borderRadiusSecondary: 12
      },
      components: {
        MuiCard: {
          styleOverrides: {
            root: {
              marginLeft: 0,
              width: 'auto',
              // Target the button specifically with the MuiCard-root class
              '&.MuiPaper-root.MuiPaper-outlined.MuiPaper-rounded': {
                height: 'auto !important'  
              },
              '&.outlined': {
                width: '368px',
                height: '102px'
              }
            }
          }
        },
        MuiCardContent: {
          styleOverrides: {
            root: {
              fontSize: '50px',
              
            }
          }
        },
        MuiListItemText: {
          styleOverrides: {
            root: {
              fontSize: '12px',
              '& .MuiListItemText-primary': {
                fontSize: '18px !important'
              }
            }
          }
        },
        MuiButtonBase: {
          styleOverrides: {
            root: {
              fontSize: '16px',
              width: '150px',
               height: 'fit-content'
            }
          }
        },
        MuiButton: {
          styleOverrides: {
            root: {
              fontSize: '16px',
              width: '150px',
              height: 'fit-content'
            }
          }
        },

        MuiPaper: {
          styleOverrides: {
            root: {
              fontSize: '16px',
              width: '150px',
              height: 'fit-content'
            }
          }
        },

        MuiCardHeader: {
          styleOverrides: {
            root: {
              marginBottom: '10px'
            }
          }
        }
      }
    }
  }), []);

  return (
    <div className="widget-page">
      <LiFiWidget integrator="a-block-of-crypto" config={widgetConfig} />
    </div>
  );
};

export default WidgetPage;


