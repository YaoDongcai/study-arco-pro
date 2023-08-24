<template>
  <div ref="view3D" class="view3D">这里放3D</div>
</template>

<script lang="ts" setup>
  // 开始设置js 即可
  import '@kitware/vtk.js/favicon';

  // Load the rendering pieces we want to use (for both WebGL and WebGPU)
  import '@kitware/vtk.js/Rendering/Profiles/Volume';
  import vtkColorTransferFunction from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction';
  import vtkPiecewiseFunction from '@kitware/vtk.js/Common/DataModel/PiecewiseFunction';

  import vtkVolume from '@kitware/vtk.js/Rendering/Core/Volume';
  import vtkVolumeMapper from '@kitware/vtk.js/Rendering/Core/VolumeMapper';
  import vtkXMLImageDataReader from '@kitware/vtk.js/IO/XML/XMLImageDataReader';
  //   import vtkHttpDataSetReader from '@kitware/vtk.js/IO/Core/HttpDataSetReader';
  // Force DataAccessHelper to have access to various data source
  import '@kitware/vtk.js/IO/Core/DataAccessHelper/HtmlDataAccessHelper';
  import '@kitware/vtk.js/IO/Core/DataAccessHelper/JSZipDataAccessHelper';
  import { onMounted, ref } from 'vue';
  import vtkGenericRenderWindow from '@kitware/vtk.js/Rendering/Misc/GenericRenderWindow';

  const vtiReader = vtkXMLImageDataReader.newInstance();

  const fullScreenRenderer = vtkGenericRenderWindow.newInstance({
    background: [0, 0, 0],
  });
  const renderer = fullScreenRenderer.getRenderer();
  const renderWindow2 = fullScreenRenderer.getRenderWindow();
  renderWindow2.getInteractor().setDesiredUpdateRate(30);
  //   vtiReader.loadData
  const folder = `${window.location.protocol}//${window.location.host}`;
  // const zztFolder = folder + "/STL/CAA.00095.STL";
  const zztFolder = `${folder}/cvi/ct.vti`;

  // 设置DOM的数据
  function updateEdgeGradient(renderWindow: any, actor: any) {
    const lookupTable = vtkColorTransferFunction.newInstance();
    lookupTable.addRGBPoint(-512, 0.0, 0.0, 0.0);
    lookupTable.addRGBPoint(670, 0.6, 0.0, 0.0);
    lookupTable.addRGBPoint(1961, 0.86, 0.67, 0.3);
    lookupTable.addRGBPoint(2893, 1.0, 1.0, 1.0);
    lookupTable.addRGBPoint(3072, 1.0, 1.0, 1.0);

    const piecewiseFunction = vtkPiecewiseFunction.newInstance();
    piecewiseFunction.addPoint(886, 0.0);
    piecewiseFunction.addPoint(1853, 0.28);
    piecewiseFunction.addPoint(3072, 0.5);
    const property = actor.getProperty();

    property.setRGBTransferFunction(0, lookupTable);
    property.setScalarOpacity(0, piecewiseFunction);
    renderWindow.render();
  }
  const view3D = ref('');
  onMounted(() => {
    vtiReader.setUrl(zztFolder, { binary: true, loadData: true }).then(() => {
      // view3D.renderer.resetCamera();
      // view3D.renderWindow.render();
      fullScreenRenderer.setContainer(view3D.value);
      const source = vtiReader.getOutputData(0);
      console.log('---source', source);
      const mapper = vtkVolumeMapper.newInstance();
      const actor = vtkVolume.newInstance();

      const dataArray =
        source.getPointData().getScalars() ||
        source.getPointData().getArrays()[0];

      // Pipeline handling
      actor.setMapper(mapper);
      mapper.setInputData(source);
      renderer.addActor(actor);

      // Configuration
      const sampleDistance =
        0.7 *
        Math.sqrt(
          source
            .getSpacing()
            .map((v) => v * v)
            .reduce((a, b) => a + b, 0)
        );
      mapper.setSampleDistance(sampleDistance);

      // First render
      renderer.resetCamera();
      updateEdgeGradient(renderWindow2, actor);
    });
  });
  // vtiReader.parseAsArrayBuffer(fileContents);
</script>
