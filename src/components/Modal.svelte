<script>
    import { fade, scale } from 'svelte/transition';
    export let showModal = false
    
    </script>
    {#if showModal === true}
    <div class="modal-background" transition:fade>
        <div class="modal-content-container" transition:scale>
            <slot/>
        </div>
    </div>
    {/if}
    <style>
        .modal-background{
            position: fixed;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.377);
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .modal-content-container{
            min-width: 340px;
            max-width: 800px;
            max-height: 700px;
            background-color: #eee;
            border: 1px solid transparent;
            border-radius: 4px;
            padding: 1rem;
        }
    </style>