import { Editor } from "./components/editor/Editor";

function App() {

  function changed(e: any) {
    console.log("Changed", e);
  }
  return (
    <div className="w-screen h-screen">
      <Editor callback={changed} />
    </div>
  );
}

export default App;
