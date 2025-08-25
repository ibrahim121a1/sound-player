import TrackPlayer, { Event, Capability, RepeatMode } from 'react-native-track-player';


export async function playbackService() {
// Set capabilities & options when the service starts
await TrackPlayer.updateOptions({
android: {
appKilledPlaybackBehavior: TrackPlayer.AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
},
capabilities: [
Capability.Play,
Capability.Pause,
Capability.SkipToNext,
Capability.SkipToPrevious,
Capability.SeekTo,
Capability.Stop,
],
compactCapabilities: [Capability.Play, Capability.Pause, Capability.SkipToNext],
progressUpdateEventInterval: 2,
});


TrackPlayer.setRepeatMode(RepeatMode.Queue);


// Remote events (lock-screen / notification)
TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
TrackPlayer.addEventListener(Event.RemoteStop, () => TrackPlayer.stop());
TrackPlayer.addEventListener(Event.RemoteNext, () => TrackPlayer.skipToNext());
TrackPlayer.addEventListener(Event.RemotePrevious, () => TrackPlayer.skipToPrevious());
TrackPlayer.addEventListener(Event.RemoteSeek, ({ position }) => TrackPlayer.seekTo(position));


// Optional: respond to audio becoming noisy (e.g., headphones unplugged)
TrackPlayer.addEventListener(Event.AudioBecomingNoisy, () => TrackPlayer.pause());


// Keep the service running and listeners active
}