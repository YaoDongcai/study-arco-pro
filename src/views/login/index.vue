<template>
  <div class="container"> </div>
</template>

<script lang="ts" setup>
  import vtkWSLinkClient from '@kitware/vtk.js/IO/Core/WSLinkClient';
  import SmartConnect from 'wslink/src/SmartConnect';
  import vtkRemoteView from '@kitware/vtk.js/Rendering/Misc/RemoteView';

  vtkWSLinkClient.setSmartConnectClass(SmartConnect);

  document.body.style.padding = '0';
  document.body.style.margin = '0';

  const divRenderer = document.createElement('div');
  document.body.appendChild(divRenderer);

  divRenderer.style.position = 'relative';
  divRenderer.style.width = '100vw';
  divRenderer.style.height = '100vh';
  divRenderer.style.overflow = 'hidden';

  const clientToConnect = vtkWSLinkClient.newInstance();

  // Error
  clientToConnect.onConnectionError((httpReq) => {
    const message =
      (httpReq && httpReq.response && httpReq.response.error) ||
      `Connection error`;
    console.error(message);
    console.log(httpReq);
  });

  // Close
  clientToConnect.onConnectionClose((httpReq) => {
    const message =
      (httpReq && httpReq.response && httpReq.response.error) ||
      `Connection close`;
    console.error(message);
    console.log(httpReq);
  });

  // hint: if you use the launcher.py and ws-proxy just leave out sessionURL
  // (it will be provided by the launcher)
  const config = {
    application: 'cone',
    sessionURL: 'ws://localhost:1234/ws',
  };

  // Connect
  clientToConnect
    .connect(config)
    .then((validClient) => {
      const viewStream = clientToConnect
        .getImageStream()
        .createViewStream('-1');

      const view = vtkRemoteView.newInstance({
        rpcWheelEvent: 'viewport.mouse.zoom.wheel',
        viewStream,
      });
      const session = validClient.getConnection().getSession();
      view.setSession(session);
      view.setContainer(divRenderer);
      view.setInteractiveRatio(0.7); // the scaled image compared to the clients view resolution
      view.setInteractiveQuality(50); // jpeg quality

      window.addEventListener('resize', view.resize);
    })
    .catch((error) => {
      console.error(error);
    });
</script>

<style lang="less" scoped>
  .container {
    display: flex;
    height: 100vh;

    .banner {
      width: 550px;
      background: linear-gradient(163.85deg, #1d2129 0%, #00308f 100%);
    }

    .content {
      position: relative;
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
      padding-bottom: 40px;
    }

    .footer {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 100%;
    }
  }

  .logo {
    position: fixed;
    top: 24px;
    left: 22px;
    z-index: 1;
    display: inline-flex;
    align-items: center;

    &-text {
      margin-right: 4px;
      margin-left: 4px;
      color: var(--color-fill-1);
      font-size: 20px;
    }
  }
</style>

<style lang="less" scoped>
  // responsive
  @media (max-width: @screen-lg) {
    .container {
      .banner {
        width: 25%;
      }
    }
  }
</style>
