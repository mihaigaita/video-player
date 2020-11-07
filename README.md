# HTML5 Custom React Video Player

Simple Video Player with custom controls, modeled after YouTube. Uses React Hooks and MobX.

Screenshot:

![Screenshot](screenshot.png?raw=true)

[Click here for a DEMO of the player online](https://mihaigaita.github.io/video-player/build/index.html)

## Implemented Features
- Progress bar (with expected seek time preview on hover and ability to drag & hold)
- Play / Pause Button
- Mute / Un-mute Sound Button (with Slider)
- Settings Button (used to change playback speed)
- Full Screen Button
- Controls and Mouse cursor hide automatically after 4s after mouse movement stops during playback
- State management using [MobX](https://mobx.js.org/)
- Material Design System via [Material-UI](https://material-ui.com/) React library

### Implemented Animations and Visual Effects
- Progress Bar expands vertically on hover
- Volume slider expands horizontally on hover
- Control buttons increase in size on full-screen
- Brief pause / play feedback icon transition is shown in the center of the video
- Playback of timeline red bar is smoothed using requestAnimationFrame instead of video "timeupdate" event
- A preview of the peeked time is shown for the timeline as well, using a gray bar behind the main red one
- A dark backdrop is enabled when dragging the timeline thumb (i.e. when manually changing the current time position)

### Future Improvements
- Add Typescript
- Add Tooltips
- Add playback control using standard key presses
- Replace Material-UI slider used on video progress and seek with improved custom component with throttling
- Replace divs used only for styling with Box elements from Material-UI to emulate Atomic CSS more idiomatically
- Fix seek preview when hovering near the thumb button in the progress bar

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Note

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).