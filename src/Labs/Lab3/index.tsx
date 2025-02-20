import ForLoops from "./ForLoops";
import Highlight from "./Highlight";
import Square from "./Square";
import Add from "./Add";
import Styles from "./Styles";
import Classes from "./Classes";
import DestructingImports from "./DestructingImports";
import FunctionDestructing from "./FunctionDestructing";
import Destructing from "./Destructing";
import Spreading from "./Spreading";
import TodoList from "./todos/TodoList";
import House from "./House";
import JsonStringify from "./JsonStringify";
import FilterFunction from "./FilterFunction";
import FindIndex from "./FindIndex";
import FindFunction from "./FindFunction";
import MapFunction from "./MapFunction";
import AddingAndRemovingToFromArrays from "./AddingAndRemovingToFromArrays";
import ArrayIndexAndLength from "./ArrayIndexAndLength";
import SimpleArrays from "./SimpleArrays";
import TemplateLiterals from "./TemplateLiterals";
import ImpliedReturn from "./ImpliedReturn";
import ArrowFunctions from "./ArrowFunctions";
import LegacyFunctions from "./LegacyFunctions";
import ConditionalOutputInline from "./ConditionalOutputInline";
import ConditionalOutputIfElse from "./ConditionalOutputIfElse";
import TernaryOperator from "./TernaryOperator";
import BooleanVariable from "./BooleanVariables";
import IfElse from "./IfElse";
import VariableTypes from "./VariableTypes";
import VariablesAndConstants from "./VariablesAndConstants";
import PathParameters from "./PathParameters";
export default function Lab3() {
    console.log('Hello World!')
    return (
      <div id="wd-lab3">
        <h3>Lab 3</h3>
        <VariablesAndConstants />
        <VariableTypes />
        <BooleanVariable />
        <IfElse />
        <TernaryOperator />
        <ConditionalOutputIfElse />
        <ConditionalOutputInline />
        <LegacyFunctions />
        <ArrowFunctions />
        <ImpliedReturn />
        <TemplateLiterals />
        <SimpleArrays />
        <ArrayIndexAndLength />
        <AddingAndRemovingToFromArrays />
        <ForLoops />
        <MapFunction />
        <FindFunction />
        <FindIndex />
        <FilterFunction />
        <JsonStringify />
        <House />
        <TodoList />
        <Spreading />
        <Destructing />
        <FunctionDestructing />
        <DestructingImports />
        <Classes />
        <Styles />
        <Add a={3} b={4} />
        <h4>Squre of 4</h4>
        <Square>4</Square>
        <hr />
        <Highlight>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipitratione eaque illo minus cum, saepe totam
            vel nihil repellat nemo explicabo excepturi consectetur. Modi omnis minus sequi maiores, provident voluptates.
        </Highlight>
        <hr />
        <PathParameters />
        <hr />
      </div>
    );
  }
  