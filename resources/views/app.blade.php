<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
    <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Ephesis&display=swap" rel="stylesheet">


    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ config('app.name') }}</title>
    
    {{-- Fallback jika Vite tidak jalan --}}
    @env('local')
        @if(file_exists(public_path('hot')))
            {{-- Vite dev server aktif --}}
            @viteReactRefresh
            @vite(['resources/css/app.css', 'resources/js/app.jsx'])
        @else
            {{-- Fallback untuk development tanpa Vite --}}
            <script type="module" src="http://localhost:5173/@vite/client"></script>
            <script type="module" src="http://localhost:5173/resources/js/app.jsx"></script>
        @endif
    @else
        {{-- Production --}}
        @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    @endenv
    
    @inertiaHead
</head>
<body>
    @inertia
</body>
</html>