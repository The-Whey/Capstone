import React, { useEffect, useRef, useState } from 'react';
import H from '@here/maps-api-for-javascript';

const Map = ( props ) => {
    const mapRef = useRef(null);
    const map = useRef(null);
    const platform = useRef(null)
    const { apikey } = props;
    const ourlocation = {lat: 47.6038302, lng: -122.3391395}

    function getMarkerIcon(color) {
        const svgCircle = `<svg width="20" height="20" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <g id="marker">
                    <circle cx="10" cy="10" r="7" fill="${color}" stroke="${color}" stroke-width="4" />
                    </g></svg>`;
        return new H.map.Icon(svgCircle, {
            anchor: {
                x: 10,
                y: 10
            }
        });
    }
    
    getMarkerIcon('red')

    useEffect(
        () => {
            // Check if the map object has already been created
            if (!map.current) {
            
            // Create a platform object with the API key
            platform.current = new H.service.Platform({ apikey });
            // Create a new Raster Tile service instance
            const rasterTileService = platform.current.getRasterTileService({
                queryParams: {
                style: "explore.day",
                size: 512,
                },
            });
            // Creates a new instance of the H.service.rasterTile.Provider class
            // The class provides raster tiles for a given tile layer ID and pixel format
            const rasterTileProvider = new H.service.rasterTile.Provider(
                rasterTileService
            );
            // Create a new Tile layer with the Raster Tile provider
            const rasterTileLayer = new H.map.layer.TileLayer(rasterTileProvider);
            // Create a new map instance with the Tile layer, center and zoom level
            const newMap = new H.Map(mapRef.current, rasterTileLayer, {
                pixelRatio: window.devicePixelRatio,
                center: ourlocation,
                zoom: 11,
            });
        
            // Add panning and zooming behavior to the map
            const behavior = new H.mapevents.Behavior(
                new H.mapevents.MapEvents(newMap),
                new H.map.Marker(ourlocation, getMarkerIcon('red'))
            );
        
            // Set the map object to the reference
            map.current = newMap;
            getMarkerIcon('red')

            }
        },
        // Dependencies array
        [apikey]
        );

        // Return a div element to hold the map
        return (
        <div>
            <div style={ { width: "100%", height: "150px" } } ref={mapRef} />
        </div>);
   }

export default Map;

