import { Link } from "react-router-dom";

export default function TOC() {
    return (
        <ul>
        <li><Link to="/Labs/Lab2/BackgroundColors">Background Colors</Link></li>
        <li><Link to="/Labs/Lab2/ForegroundColors">Foreground Colors</Link></li>
        <li><Link to="/Labs/Lab2/Borders">Borders</Link></li>
        <li><Link to="/Labs/Lab2/Padding">Padding</Link></li>
        <li><Link to="/Labs/Lab2/Margins">Margins</Link></li>
        <li><Link to="/Labs/Lab2/Corners">Corners</Link></li>
        <li><Link to="/Labs/Lab2/Dimensions">Dimensions</Link></li>
        <li><Link to="/Labs/Lab2/Positions">Positions</Link></li>
        <li><Link to="/Labs/Lab2/Zindex">Z Index</Link></li>
        <li><Link to="/Labs/Lab2/Float">Float</Link></li>
        <li><Link to="/Labs/Lab2/GridLayout">Grid Layout</Link></li>
        <li><Link to="/Labs/Lab2/Flex">Flex</Link></li>
        <li><Link to="/Labs/Lab2/ReactIcons">React Icons</Link></li>
        <li><Link to="/Labs/Lab2/BootstrapGrid">Bootstrap Grids</Link></li>
        <li><Link to="/Labs/Lab2/ScreenSizeLabel">Screen Size Label</Link></li>
        <li><Link to="/Labs/Lab2/BootstrapTables">Bootstrap Tables</Link></li>
        <li><Link to="/Labs/Lab2/BootstrapLists">Bootstrap Lists</Link></li>
        <li><Link to="/Labs/Lab2/BootstrapForms">Bootstrap Forms</Link></li>
        <li><Link to="/Labs/Lab2/BootstrapNavigation">Bootstrap Navigation</Link></li>
        </ul>
    );
}