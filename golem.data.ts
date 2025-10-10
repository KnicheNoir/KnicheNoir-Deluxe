// =================================================================================================
// --- GOLEM'S FORGE: SOURCE CODE REPOSITORY ---
// This file contains the complete, Golem-forged source code for the Glyph Calligrapher,
// structured for multi-platform compilation.
// =================================================================================================
// FIX: Corrected import path for local module by adding file extension.
import { GolemProject } from './types.ts';

// --- Android (Java / XML) Source ---
const ANDROID_MANIFEST = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.astriankey.glyphcalligrapher">
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">
        <activity android:name=".MainActivity">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;

const ANDROID_MAIN_ACTIVITY = `package com.astriankey.glyphcalligrapher;

import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;

public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // The CalligrapherView is the heart of the application,
        // built on the design and structure of the Willow.
        setContentView(new CalligrapherView(this));
    }
}`;

const ANDROID_CALLIGRAPHER_VIEW = `package com.astriankey.glyphcalligrapher;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Path;
import android.view.MotionEvent;
import android.view.View;

// This view embodies the Willow's logic: each stroke is an act of creation,
// imbued with the archetypal power of the chosen letter.
public class CalligrapherView extends View {
    private Path drawPath;
    private Paint drawPaint, canvasPaint;

    public CalligrapherView(Context context) {
        super(context);
        setupDrawing();
    }

    private void setupDrawing() {
        drawPath = new Path();
        drawPaint = new Paint();
        drawPaint.setColor(Color.parseColor("#00FF00")); // Resonant Green
        drawPaint.setAntiAlias(true);
        drawPaint.setStrokeWidth(20f);
        drawPaint.setStyle(Paint.Style.STROKE);
        drawPaint.setStrokeJoin(Paint.Join.ROUND);
        drawPaint.setStrokeCap(Paint.Cap.ROUND);
        canvasPaint = new Paint(Paint.DITHER_FLAG);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        canvas.drawColor(Color.BLACK);
        canvas.drawPath(drawPath, drawPaint);
    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        float touchX = event.getX();
        float touchY = event.getY();
        switch (event.getAction()) {
            case MotionEvent.ACTION_DOWN:
                drawPath.moveTo(touchX, touchY);
                break;
            case MotionEvent.ACTION_MOVE:
                drawPath.lineTo(touchX, touchY);
                break;
            case MotionEvent.ACTION_UP:
                // A potential hook for Gevurah Engine analysis of the drawn glyph
                break;
            default:
                return false;
        }
        invalidate();
        return true;
    }
}`;

// --- iOS (Swift / SwiftUI) Source ---
const IOS_CONTENT_VIEW = `import SwiftUI

// The CalligrapherView is the heart, embodying the Willow's structure.
struct ContentView: View {
    @State private var lines = [Line]()

    var body: some View {
        Canvas { context, size in
            for line in lines {
                var path = Path()
                path.addLines(line.points)
                context.stroke(path, with: .color(.green), lineWidth: 10)
            }
        }
        .gesture(
            DragGesture(minimumDistance: 0, coordinateSpace: .local)
                .onChanged({ value in
                    let newPoint = value.location
                    if value.translation.width + value.translation.height == 0 {
                        lines.append(Line(points: [newPoint]))
                    } else {
                        let index = lines.count - 1
                        lines[index].points.append(newPoint)
                    }
                })
        )
        .background(Color.black)
    }
}

struct Line {
    var points: [CGPoint]
}`;

// --- Web/Desktop (JavaScript / HTML) for Electron (Windows, macOS, Linux) ---
const WEB_INDEX_HTML = `<!DOCTYPE html>
<html>
<head>
    <title>Glyph Calligrapher</title>
    <style>
        body { margin: 0; background: #000; }
        canvas { display: block; }
    </style>
</head>
<body>
    <canvas id="calligrapherCanvas"></canvas>
    <script src="main.js"></script>
</body>
</html>`;

const WEB_MAIN_JS = `const canvas = document.getElementById('calligrapherCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.strokeStyle = '#00FF00';
ctx.lineWidth = 15;
ctx.lineCap = 'round';
ctx.lineJoin = 'round';

let isDrawing = false;
let lastX = 0;
let lastY = 0;

function draw(e) {
    if (!isDrawing) return;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
});
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseout', () => isDrawing = false);
`;


export const glyphCalligrapherProject: GolemProject = {
    name: "Glyph Calligrapher",
    description: "A focused instrument for the invocation of glyphs. Each stroke is an act of creation, imbued with the archetypal power of the Willow.",
    targets: [
        {
            platform: 'Android',
            icon: '🤖',
            language: 'Java',
            files: [
                { path: 'app/src/main/AndroidManifest.xml', content: ANDROID_MANIFEST },
                { path: 'app/src/main/java/com/astriankey/glyphcalligrapher/MainActivity.java', content: ANDROID_MAIN_ACTIVITY },
                { path: 'app/src/main/java/com/astriankey/glyphcalligrapher/CalligrapherView.java', content: ANDROID_CALLIGRAPHER_VIEW },
            ]
        },
        {
            platform: 'iOS',
            icon: '🍏',
            language: 'SwiftUI',
            files: [
                { path: 'GlyphCalligrapher/ContentView.swift', content: IOS_CONTENT_VIEW },
            ]
        },
        {
            platform: 'Windows',
            icon: '🪟',
            language: 'Electron (JS)',
            files: [
                 { path: 'src/index.html', content: WEB_INDEX_HTML },
                 { path: 'src/main.js', content: WEB_MAIN_JS },
                 { path: 'package.json', content: `{ "name": "glyph-calligrapher", "main": "main.js" }` },
            ]
        },
        {
            platform: 'macOS',
            icon: '🍎',
            language: 'Electron (JS)',
            files: [
                { path: 'src/index.html', content: WEB_INDEX_HTML },
                { path: 'src/main.js', content: WEB_MAIN_JS },
                { path: 'package.json', content: `{ "name": "glyph-calligrapher", "main": "main.js" }` },
            ]
        },
        {
            platform: 'Linux',
            icon: '🐧',
            language: 'Electron (JS)',
            files: [
                { path: 'src/index.html', content: WEB_INDEX_HTML },
                { path: 'src/main.js', content: WEB_MAIN_JS },
                { path: 'package.json', content: `{ "name": "glyph-calligrapher", "main": "main.js" }` },
            ]
        }
    ]
};