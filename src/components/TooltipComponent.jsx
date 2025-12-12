import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

const TooltipComponent = () => {
  return (
    <>
      <Tooltip id="global-tooltip" />
      <Tooltip id="price-tooltip" place="top" content="Click to see price details" />
      <Tooltip id="category-tooltip" place="right" content="Filter by this category" />
      <Tooltip id="user-tooltip" place="bottom" content="View profile settings" />
    </>
  );
};

export default TooltipComponent;