<script>
    import { fade, scale } from 'svelte/transition';
    export let showModal = false;
    export let height='';
    export let width= '';
    export let onOverFlowY = ''
    </script>
    {#if showModal === true}
    <div class="modal-background" transition:fade>
        <div class="modal-content-container" style="height: {height}; width: {width}; overflow-y: {onOverFlowY}" transition:scale>
            <slot/>
        </div>
    </div>
    {/if}
    <style>
        .modal-background{
            position:absolute;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.377);
            display: flex;
            justify-content: center;
            align-items: center;
            overflow-y: scroll;
        }
        .modal-content-container{
            position: fixed;
            min-height: 420px;
            min-width: 360px;
            background-color: #eee;
            border: 1px solid transparent;
            border-radius: 4px;
            padding: 1rem;
            z-index: 9999;
        }
    </style>