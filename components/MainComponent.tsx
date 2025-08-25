import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PLAYLIST } from "../track";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TrackPlayer, { Event, State, usePlaybackState, useProgress } from "react-native-track-player";

function millisToTime(seconds: number) {
    const mm = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const ss = Math.floor(seconds % 60)
      .toString()
      .padStart(2, '0');
    return `${mm}:${ss}`;
  }

const MainComponent = () => {
    const insets = useSafeAreaInsets();
    const playback = usePlaybackState();
    const { position, duration } = useProgress(250);
  
    const [isReady, setIsReady] = useState(false);
    const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
    const [currentTitle, setCurrentTitle] = useState('');
    const [currentArtist, setCurrentArtist] = useState('');
  
    const updateCurrentTrack = useCallback(async () => {
      const track = await TrackPlayer.getActiveTrack();
      if (track) {
        setCurrentTrackId(track.id ?? null);
        setCurrentTitle(track.title ?? '');
        setCurrentArtist(track.artist ?? '');
      }
    }, []);
  
    useEffect(() => {
      const setupPlayer = async () => {
        await TrackPlayer.setupPlayer();
        await TrackPlayer.reset();
        await TrackPlayer.add(PLAYLIST);
        setIsReady(true);
        updateCurrentTrack();
      };
  
      setupPlayer();
  
      const sub = TrackPlayer.addEventListener(
        Event.PlaybackActiveTrackChanged,
        updateCurrentTrack
      );
  
      return () => sub.remove();
    }, [updateCurrentTrack]);
  
    const togglePlay = useCallback(async () => {
      if (!isReady) return;
      const state = await TrackPlayer.getState();
      state === State.Playing
        ? await TrackPlayer.pause()
        : await TrackPlayer.play();
    }, [isReady]);
  
    const onSelectTrack = async (id: string) => {
      const queue = await TrackPlayer.getQueue();
      const idx = queue.findIndex(t => t.id === id);
      if (idx >= 0) {
        await TrackPlayer.skip(idx);
        await TrackPlayer.play();
      }
    };
  
    if (!isReady) {
      return (
          <View style={[styles.container, { paddingTop: insets.top }]}>
            <ActivityIndicator size="large" />
            <Text style={styles.loadingText}>Loading player...</Text>
          </View>
      );
    }
    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.title}>{currentTitle}</Text>
        <Text style={styles.artist}>{currentArtist}</Text>

        <Text style={styles.timer}>
          {millisToTime(position)} / {millisToTime(duration)}
        </Text>

        <TouchableOpacity
  onPress={togglePlay}
  style={[styles.button, !isReady && styles.buttonDisabled]}
  disabled={!isReady}
>
  {playback.state === State.Buffering || playback.state === State.Loading ? (
    <ActivityIndicator color="#fff" />
  ) : (
    <Text style={styles.buttonText}>
      {playback.state === State.Playing ? 'Pause' : 'Play'}
    </Text>
  )}
</TouchableOpacity>

        <FlatList
          data={PLAYLIST}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => onSelectTrack(item.id)}
              style={[
                styles.trackItem,
                item.id === currentTrackId && styles.trackItemActive,
              ]}
            >
              <Text
                style={[
                  styles.trackTitle,
                  item.id === currentTrackId && styles.activeText,
                ]}
              >
                {item.title}
              </Text>
              <Text style={styles.trackArtist}>{item.artist}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    )
}

export default MainComponent;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    loadingText: { marginTop: 10, fontSize: 16, color: 'gray' },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
    artist: { fontSize: 16, color: 'gray', marginBottom: 12 },
    timer: { fontSize: 14, marginBottom: 10, color: '#444' },
    button: {
      padding: 12,
      marginVertical: 20,
      backgroundColor: '#4CAF50',
      alignItems: 'center',
      borderRadius: 8,
    },
    buttonDisabled: { backgroundColor: '#bbb' },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    trackItem: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    trackItemActive: { backgroundColor: '#f0f8ff' },
    trackTitle: { fontSize: 16 },
    trackArtist: { fontSize: 14, color: 'gray' },
    activeText: { fontWeight: 'bold', color: '#2a7' },
  });

  