import PropTypes from "prop-types";
import Box from "./Box";

// content column every remote page sits in; the shell draws the chrome
function Page({ children }) {
  return (
    <Box px={{ xs: 2, md: 4 }} py={3} maxWidth={1440}>
      {children}
    </Box>
  );
}

Page.propTypes = { children: PropTypes.node };

export default Page;
